using Microsoft.AspNetCore.Mvc;
using RubikApi.Models;
using RubikApi.Services;

namespace RubikApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : Controller
    {
        private readonly ILoginService _loginService;

        public LoginController(ILoginService loginService)
        {
            _loginService = loginService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> LogIn([FromBody] LoginModel user)
        {
            if (user == null)
            {
                return BadRequest("User not found");
            }

            var logInResponse = await _loginService.Login(user);

            return (logInResponse.GetType() == typeof(string)) ? Unauthorized(logInResponse) : Ok(logInResponse);
        }

    }
}
