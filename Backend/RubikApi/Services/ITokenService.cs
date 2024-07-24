using RubikApi.Models;
using System.Security.Claims;

namespace RubikApi.Services
{
    public interface ITokenService
    {
        string GenerateAccessToken(IEnumerable<Claim> claims);
        string GenerateRefreshToken();

        public Task<LoginResponse> RefreshToken(TokenApiModel tokenApiModel);

        ClaimsPrincipal GetPrincipalFromExpiredToken(string expiredToken);

        public Task<bool> Revoke(string email);
    }
}
