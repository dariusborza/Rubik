using System.ComponentModel.DataAnnotations.Schema;

namespace RubikApi.Models
{
    public class Review
    {
        public string ReviewText { get; set; }
        public string? GameId { get; set; }
        public int? UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        [ForeignKey("GameId")]
        public virtual Game? Game { get; set; }
    }
}
