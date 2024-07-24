using Microsoft.AspNetCore.Antiforgery;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RubikApi.Models
{
    public class User
    {
        public User()
        {
            Score = new Score();
        }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Email { get; set; }

        public string Nickname { get; set; }

        public string Password { get; set; }

        public string SecretAnswer { get; set; }

        public string? ProfilePicturePath { get; set; }
        
        public virtual Score? Score { get; set; } = null!;
        public virtual List<Game>? Games { get; set; }

        public virtual List<GameHighscore>? GamesHighScores { get; set; }

        public virtual List<Review>? Reviews { get; set; }

        public virtual ICollection<UserToken>? UserTokens { get; set; }
    }
}
