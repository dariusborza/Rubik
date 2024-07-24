namespace RubikApi.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string Email { get; set; }

        public string Nickname { get; set; }

        public string Password { get; set; }

        public string SecretAnswer { get; set; }

        public string? ProfilePicturePath { get; set; }
    }
}
