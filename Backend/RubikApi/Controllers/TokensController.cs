using Microsoft.AspNetCore.Mvc;
using RubikApi.Models;
using RubikApi.Services;

namespace RubikApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TokensController : Controller
    {
        private readonly ITokenService _tokenService;

        public TokensController(ITokenService tokenSevice)
        {
            _tokenService = tokenSevice;
        }

        [HttpPost]
        [Route("refresh")]
        public async Task<IActionResult> RefreshAsync(TokenApiModel tokenApiModel)
        {
            if (tokenApiModel is null)
                return BadRequest("Invalid client request");

            var result = await _tokenService.RefreshToken(tokenApiModel);

            return result == null ? BadRequest("InvalidClientRequest") : Ok(result);
        }

    }
}
