using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RubikApi.Models
{
    public class Score
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int Highscore { get; set; }

        public int? UserId { get; set; }
        public virtual User? User { get; set; } = null!;
    }
}
