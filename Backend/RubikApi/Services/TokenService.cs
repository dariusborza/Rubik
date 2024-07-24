using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using RubikApi.DatabaseSettings;
using RubikApi.Models;
using System.ComponentModel;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace RubikApi.Services
{
    public class TokenService : ITokenService
    {
        private readonly RubikDBContext _RubikDBContext;
        private JwtSettings _config;

        public TokenService(RubikDBContext dbContext, IOptions<JwtSettings> config)
        {
            _RubikDBContext = dbContext;
            _config = config.Value;
        }

        public string GenerateAccessToken(IEnumerable<Claim> claims)
        {
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.Key));
            var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var tokenOptions = new JwtSecurityToken(
                issuer: _config.Issuer,
                audience: _config.Audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(5),
                signingCredentials: signingCredentials
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

            return tokenString;
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];

            using (var randomNumberGenerator = RandomNumberGenerator.Create())
            {
                randomNumberGenerator.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string expiredToken)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey@345"))
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var principal = tokenHandler.ValidateToken(expiredToken, tokenValidationParameters, out SecurityToken securityToken);

            var jwtSecurityToken = securityToken as JwtSecurityToken;

            if (jwtSecurityToken == null || jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Invalid Token");
            }

            return principal;
        }

        public async Task<LoginResponse> RefreshToken(TokenApiModel tokenApiModel)
        {
            string accessToken = tokenApiModel.AccessToken;
            string refreshToken = tokenApiModel.RefreshToken;

            var principal = GetPrincipalFromExpiredToken(accessToken);

            var email = principal.Identity.Name;

            var user = await _RubikDBContext.Users.FirstOrDefaultAsync(u => u.Email == email);

            var refreshTokenForUser = await _RubikDBContext.Tokens.FirstOrDefaultAsync(rt => rt.UserId == user.Id);

            if (user is null || refreshTokenForUser.RefreshToken != refreshToken || refreshTokenForUser.RefreshTokenExpiryTime <= DateTime.Now)
            {
                return null;
            }

            var newAccessToken = GenerateAccessToken(principal.Claims);
            var newRefreshToken = GenerateRefreshToken();
            var refreshTokenExpiryDate = DateTime.Now.AddDays(7);

            refreshTokenForUser.RefreshToken = newRefreshToken;

            await _RubikDBContext.SaveChangesAsync();

            return new LoginResponse
            {
                //Token = newAccessToken,
                //RefreshToken = newRefreshToken
            };
        }

        public async Task<bool> Revoke(string email)
        {
            var user = await _RubikDBContext.Users.SingleOrDefaultAsync(u => u.Email == email);

            var refreshTokenForUser = await _RubikDBContext.Tokens.FirstOrDefaultAsync(rt => rt.UserId == user.Id);

            if (refreshTokenForUser == null)
            {
                return false;
            }

            await _RubikDBContext.SaveChangesAsync();

            return true;
        }
    }
}
