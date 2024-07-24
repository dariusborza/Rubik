using RubikApi.Models;

namespace RubikApi.Services
{
    public interface IGameHighscoreService
    {
        Task<object> SaveUserScore(string gameId, int userId, int score);
        Task<List<HighscoresTop>> GetHighscoresTop(string gameId);
        Task<GameHighscore?> GetScore(string gameId, int userId);
    }
}
