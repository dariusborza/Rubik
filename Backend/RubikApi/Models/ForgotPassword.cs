namespace RubikApi.Models
{
    public class ForgotPassword
    {
        public string Email { get; set; }

        public string SecretAnswer { get; set; }
    }
}
