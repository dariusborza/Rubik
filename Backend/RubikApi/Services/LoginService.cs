using Azure.Core;
using Microsoft.EntityFrameworkCore;
using RubikApi.DatabaseSettings;
using RubikApi.Models;
using System.Security.Claims;

//var refreshtokenforuser = await FindTokenByUserId(userFoundByNickname);

//var claims = new List<Claim>
//{
//    new Claim(ClaimTypes.Name, user.Nickname)
//};

//var accessToken = _tokenService.GenerateAccessToken(claims);
//var refreshToken = _tokenService.GenerateRefreshToken();

//if (refreshtokenforuser == null)
//{
//    await AddToken(userFoundByNickname, refreshToken);
//}
//else if (refreshtokenforuser.RefreshTokenExpiryTime <= DateTime.Now)
//{
//    await RefreshTokenAvailabilityTime(refreshtokenforuser, refreshToken);
//}
//else
//{
//    await UpdateToken(refreshToken, refreshtokenforuser);
//}

//Token = accessToken,
//RefreshToken = refreshToken,

namespace RubikApi.Services
{
    public class LoginService : ILoginService
    {
        private readonly RubikDBContext _dbContext;
        private readonly ITokenService _tokenService;
        public LoginService(RubikDBContext dbContext, ITokenService tokenService)
        {
            _dbContext = dbContext;
            _tokenService = tokenService;
        }

        public async Task<object> Login(LoginModel user)
        {
            var userFoundByNickname = await FindUserByNickname(user.Nickname);

            if (userFoundByNickname == null)
            {
                return "User not found";
            }

            if (!IsPasswordValid(user.Password, userFoundByNickname))
            {
                return "Invalid password";
            }

            return new LoginResponse
            {
                
                UserId = userFoundByNickname.Id
            };

        }

        public async Task<User> FindUserByNickname(string nickname)
        {
            var userFound = await _dbContext.Users.FirstOrDefaultAsync(u => u.Nickname == nickname);
            return userFound;
        }

        public bool IsPasswordValid(string password, User userFoundByNickname)
        {
            var hashedPassword = HashService.CreateHash(password);
            if (hashedPassword == userFoundByNickname.Password)
            {
                return true;
            }
            return false;
        }

        public async Task AddToken(User user, string token)
        {
            var refreshTokenModel = new UserToken
            {
                UserId = user.Id,
                RefreshToken = token,
                RefreshTokenExpiryTime = DateTime.Now.AddDays(7),
            };

            _dbContext.Tokens.Add(refreshTokenModel);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateToken(string token, UserToken userRefreshToken)
        {
            userRefreshToken.RefreshToken = token;
            await _dbContext.SaveChangesAsync();
        }

        public async Task<UserToken> FindTokenByUserId(User user)
        {
            var refreshTokenForUser = await _dbContext.Tokens.FirstOrDefaultAsync(rt => rt.UserId == user.Id);
            return refreshTokenForUser;
        }

        public async Task RefreshTokenAvailabilityTime(UserToken userRefreshToken, string newRefreshToken)
        {
            userRefreshToken.RefreshToken = newRefreshToken;
            userRefreshToken.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);
            await _dbContext.SaveChangesAsync();
        }
    }
}
