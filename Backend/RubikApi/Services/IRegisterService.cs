using RubikApi.Models;

namespace RubikApi.Services
{
    public interface IRegisterService
    {
        Task<object> Register(User user);
        Task<User?> GetUserById(int id);
        Task<MyProfileUser?> GetProfileUserById(int id);
        Task<List<User>> GetAllUsers();
        Task<UserSettings?> GetUserSettingsById(int id);
        Task<User> GetUserByEmail(string email);
        Task<string> UpdateForgotPassword(ForgotPassword model);
        Task<object> UpdateProfilePicture(int userId, string picturePath);
        Task<object> UpdatePassword(int userId, string oldPassword, string newPassword);
        Task<object> UpdateNickname(int userId, string nickname);
    }
}
