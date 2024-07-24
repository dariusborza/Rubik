using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RubikApi.DatabaseSettings;
using RubikApi.Models;
using System.Security.Cryptography;
using System.Text;

//verific ca emailul nu exista in baza de date
//verific ca nickname ul nu exista in baza de date
//adaug parola


//var userModel = new UserModel
//{
//    Id = id,
//    Email   = user.Email,
//    Nickname = user.Nickname,  
//    SecretAnswer = user.SecretAnswer,
//    Password = user.Password,
//    ProfilePicturePath  = user.ProfilePicturePath
//};


namespace RubikApi.Services
{
    public class RegisterService : IRegisterService
    {
        private readonly RubikDBContext _dbContext;
        public RegisterService(RubikDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<object> Register(User user)
        {
            var userFound = await _dbContext.Users.FirstOrDefaultAsync(x => x.Nickname == user.Nickname);

            if (userFound != null)
            {
                return "User already exists!";
            }

            user.Password = HashService.CreateHash(user.Password);

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return user;
        }

        public async Task<User?> GetUserById(int id)
        {
            if (id == 0)
            {
                return null;
            }
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                return null;
            }

            return user;
        }

        public async Task<MyProfileUser?> GetProfileUserById(int id)
        {
            if (id == 0) { return null; }

            var user = await GetUserById(id);
            if (user == null) { return null; }

            var profileUser = new MyProfileUser();
            profileUser.Nickname = user.Nickname;
            profileUser.ProfilePicturePath = user.ProfilePicturePath;

            var level = await  _dbContext.Score.FirstOrDefaultAsync(s => s.UserId == user.Id);
            profileUser.Level = level != null ? level.Highscore : 0;

            return profileUser;
        }

        public async Task<List<User>> GetAllUsers()
        {
            var users = await _dbContext.Users.ToListAsync();
            return users;
        }

        public async Task<UserSettings?> GetUserSettingsById(int id)
        {
            if (id == 0)
            {
                return null;
            }
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                return null;
            }

            var userSettings = new UserSettings
            {
                Nickname = user.Nickname,
                ProfilePicturePath = user.ProfilePicturePath
            };
            return userSettings;
        }


        public async Task<User> GetUserByEmail(string email)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
            return user;
        }

        public async Task<string> UpdateForgotPassword(ForgotPassword model)
        {
            var user = await GetUserByEmail(model.Email);

            if(user == null)
            {
                return string.Empty;
            }

            if(user.SecretAnswer != model.SecretAnswer)
            {
                return string.Empty;
            }

            string newPassword = GenerateRandomPassword();
            user.Password = HashService.CreateHash(newPassword);

            _dbContext.Users.Update(user);
            await _dbContext.SaveChangesAsync();

            return newPassword;
        }

        public async Task<object> UpdateProfilePicture(int userId, string picturePath)
        {
            var user = await GetUserById(userId);

            if (user == null)
            {
                return "User not found";
            }

            if (picturePath == null || string.IsNullOrEmpty(picturePath))
            {
                return "No picture path was sent";
            }

            user.ProfilePicturePath = picturePath;
            _dbContext.Users.Update(user);
            await _dbContext.SaveChangesAsync();

            return user;
        }

        public async Task<object> UpdatePassword(int userId, string oldPassword, string newPassword)
        {
            var user = await GetUserById(userId);
            if (user == null)
            {
                return "User doesn't exist";
            }

            var isSameOldPassword = IsPasswordValid(oldPassword, user);

            if (!isSameOldPassword)
            {
                return "Wrong old password";
            }

            user.Password = HashService.CreateHash(newPassword);
            _dbContext.Users.Update(user); 
            await _dbContext.SaveChangesAsync();

            return user;
        }

        public async Task<object> UpdateNickname(int userId, string nickname)
        {
            var user = await GetUserById(userId);

            if(user == null)
            {
                return "User doesn't exist";
            }

            var existingUserWithNickname = await _dbContext.Users.Where(u => u.Nickname == nickname).FirstOrDefaultAsync();

            if (existingUserWithNickname != null)
            {
                return "Nickname is already taken";
            }

            user.Nickname = nickname;
            _dbContext.Users.Update(user);
            await _dbContext.SaveChangesAsync();

            return user;
            
        }

        private bool IsPasswordValid(string password, User user)
        {
            var hashedPassword = HashService.CreateHash(password);
            if (hashedPassword == user.Password)
            {
                return true;
            }
            return false;
        }
        private string GenerateRandomPassword()
        {
            var length = 12;
            const string validChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            StringBuilder res = new StringBuilder();
            using (RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider())
            {
                byte[] uintBuffer = new byte[sizeof(uint)];
                while (length-- > 0)
                {
                    rng.GetBytes(uintBuffer);
                    uint num = BitConverter.ToUInt32(uintBuffer, 0);
                    res.Append(validChars[(int)(num % (uint)validChars.Length)]);

                }
            }
            return res.ToString();
        }
    }
}
