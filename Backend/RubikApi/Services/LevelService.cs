using Microsoft.EntityFrameworkCore;
using RubikApi.DatabaseSettings;
using RubikApi.Models;

namespace RubikApi.Services
{
    public class LevelService : ILevelService
    {
        private readonly RubikDBContext _dbContext;

        public LevelService(RubikDBContext dBContext)
        {
            _dbContext = dBContext;
        }

        public async Task IncreaseLevel(int userId)
        {
            var currentLevel = await _dbContext.Score.FirstOrDefaultAsync(u => u.UserId == userId);

            var totalScore = _dbContext.GamesHighscores.Where(s=>s.UserId == userId).Sum(s => s.Score);

            if (currentLevel == null)
            {
                var newLevel = new Score
                {
                    UserId = userId,
                    Highscore = totalScore
                };

                _dbContext.Score.Add(newLevel);
            }
            else
            {

                int newScoreLevel = totalScore / 20;
                currentLevel.Highscore = newScoreLevel;
            }

            await _dbContext.SaveChangesAsync();
        }

    }
}
