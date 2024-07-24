using RubikApi.Models;

namespace RubikApi.Services
{
    public interface ILoginService
    {
        Task<object> Login(LoginModel user);
    }
}
