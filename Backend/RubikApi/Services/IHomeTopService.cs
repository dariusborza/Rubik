using RubikApi.Models;

namespace RubikApi.Services
{
    public interface IHomeTopService
    {
        Task<List<User>> GetAllUsers();
        Task<List<MyProfileUser>> GetHomeTopUsers();
    }
}
