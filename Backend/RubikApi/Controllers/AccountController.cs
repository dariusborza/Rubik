using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RubikApi.DatabaseSettings;
using RubikApi.Models;
using RubikApi.Services;
using System.Net.Mail;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;

//redenumeste controller
//var user = new User
//{
//    Email = userModel.Email,
//    Nickname = userModel.Nickname,
//    Password = userModel.Password,
//    SecretAnswer = userModel.SecretAnswer,
//    ProfilePicturePath = userModel.ProfilePicturePath
//};

namespace RubikApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : Controller
    {
        private readonly IRegisterService _registerService;
        private readonly ILevelService _levelService;
        private readonly IConfiguration _configuration;

        public AccountController(IRegisterService registerService, ILevelService levelService)
        {
            _registerService = registerService;
            _levelService = levelService;
        }
        

        [HttpPost("register")]
        public async Task<IActionResult> Register(string email, string nickname, string secretAnswer, string password, string profilePic) 
        {
            var user = new User
            {
                Email = email,
                Nickname = nickname,
                Password = password,
                SecretAnswer = secretAnswer,
                ProfilePicturePath = profilePic
            };
            
            if (user is null)
            {
                return BadRequest("User is null");
            }
            var registeredUser = await _registerService.Register(user);

            return registeredUser.GetType() == typeof(string)? BadRequest(registeredUser):Ok(registeredUser);
        }


        [HttpGet("get-user")]
        public async Task<ActionResult<UserModel>> GetUser(int id)
        {
            if (id == 0)
            {
                return BadRequest("Invalid id");
            }
            var user = await _registerService.GetUserById(id);
            if (user == null)
            {
                return NotFound("User not found!");
            }
            return Ok(user);
        }

        [HttpGet("my-profile")]
        public async Task<ActionResult<MyProfileUser>> GetMyProfile(int id)
        {
            if (id == 0)
            {
                return BadRequest("Invalid id");
            }
            await _levelService.IncreaseLevel(id);
            var user = await _registerService.GetProfileUserById(id);
            if (user == null)
            {
                return NotFound("User not found!");
            }
            return Ok(user);
        }

        [HttpGet("get-user-settings")]
        public async Task<ActionResult<UserSettings>> GetUserSettings(int id)
        {
            if (id == 0)
            {
                return BadRequest("Invalid id");
            }
            var user = await _registerService.GetUserSettingsById(id);
            if (user == null)
            {
                return NotFound("User not found!");
            }
            return Ok(user);
        }

        [HttpPost("update-profile-picture")]
        public async Task<ActionResult> UpdateProfilePicture(int userId, string picturePath)
        {
            var result = await _registerService.UpdateProfilePicture(userId, picturePath);

            return result.GetType() == typeof(string) ? BadRequest(result) : Ok(result);
        }

        [HttpPost("update-password")]
        public async Task<ActionResult> UpdatePassword(int userId, string oldPassword, string newPassword)
        {
            var newUserPassword = await _registerService.UpdatePassword(userId, oldPassword, newPassword);
            return newUserPassword.GetType() == typeof(string) ? BadRequest(newPassword) : Ok(newPassword);
            //return newUserPassword.GetType() == typeof(string) ? BadRequest("Old password is incorrect!") : Ok("New password set successfully!");
        }

        [HttpPost("update-nickname")]
        public async Task<ActionResult> UpdateNickname(int userId, string nickname)
        {
            var newNickname = await _registerService.UpdateNickname(userId, nickname);
            return newNickname.GetType() == typeof(string) ? BadRequest(newNickname) : Ok(newNickname);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPassword model)
        {
            
            var newPassword = await _registerService.UpdateForgotPassword(model);

            if (newPassword == string.Empty)
            {
                return BadRequest("error");
            }

            await SendEmailAsync(model.Email, newPassword);

            return Ok("New password has been sent to your email.");
        }

        private async Task SendEmailAsync(string email, string newPassword)
        {
            MailMessage message = new MailMessage();

            message.From = new MailAddress("r16253249@gmail.com", "Rubik", System.Text.Encoding.UTF8);
            message.To.Add(new MailAddress(email));
            message.Subject = "Password Reset";
            message.IsBodyHtml = true;
            message.Body = $"Your new password is: {newPassword}";

            SmtpClient smtp = new SmtpClient();
            smtp.Port = 587;
            smtp.Host = "smtp.gmail.com";
            smtp.EnableSsl = true;
            smtp.UseDefaultCredentials = false;
            smtp.Credentials = new NetworkCredential("r16253249@gmail.com", "bipugdwvfwtuhaep");
            smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtp.Send(message);
        }
    }
}
