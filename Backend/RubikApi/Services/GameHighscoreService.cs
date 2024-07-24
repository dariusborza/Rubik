using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Writers;
using RubikApi.DatabaseSettings;
using RubikApi.Models;

namespace RubikApi.Services
{
    public class GameHighscoreService : IGameHighscoreService
    {
        private readonly RubikDBContext _dbContext;
        private readonly IRegisterService _registerService;

        public GameHighscoreService(RubikDBContext dbContext, IRegisterService registerService)
        {
            _dbContext = dbContext;
            _registerService = registerService;
        }

        public async Task<object> SaveUserScore(string gameId, int userId, int score)
        {

            // todo add current score to the one from db
            var highscore = await _dbContext.GamesHighscores.FirstOrDefaultAsync(s => s.GameId == gameId && s.UserId == userId);

            if (highscore != null)
            {
                highscore.Score = highscore.Score + score;
            }
            else
            {
                highscore = new GameHighscore
                {
                    GameId = gameId,
                    UserId = userId,
                    Score = score
                };

                _dbContext.GamesHighscores.Add(highscore);
            }

            await _dbContext.SaveChangesAsync();

            return highscore;
        }

        public async Task<List<HighscoresTop>> GetHighscoresTop(string gameId)
        {
            var users = await _registerService.GetAllUsers();

            var highscoresTop = new List<HighscoresTop>();

            foreach (var user in users)
            {
                var score = await GetScore(gameId, user.Id);
                if (score != null)
                {
                    highscoresTop.Add(new HighscoresTop
                    {
                        Nickname = user.Nickname,
                        Score = score.Score,
                    });
                }
            }

            highscoresTop.Sort((x,y) => y.Score.CompareTo(x.Score));

            return highscoresTop;
        }

        public async Task<GameHighscore?> GetScore(string gameId, int userId)
        {
            var score = await _dbContext.GamesHighscores.FirstOrDefaultAsync(s => s.GameId == gameId && s.UserId == userId);

            if(score == null)
            {
                return null;
            } 

            return score;
        }
    }
}
