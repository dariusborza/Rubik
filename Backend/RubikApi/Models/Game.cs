namespace RubikApi.Models
{
    public class Game
    {
        public string Id { get; set; }  
        public string Name { get; set; }
        public virtual List<User>? Users { get; set; }
        public virtual List<GameHighscore>? GamesHighScores { get; set; }

        public virtual List<Review>? Reviews { get; set; }
    }
}
