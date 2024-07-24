namespace RubikApi.Models
{
    public class UserToken
    {
        public int Id { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; } = null!;
    }
}
