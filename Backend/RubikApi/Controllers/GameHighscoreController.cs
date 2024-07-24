using Microsoft.AspNetCore.Mvc;
using RubikApi.Models;
using RubikApi.Services;

namespace RubikApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GameHighscoreController : Controller
    {
        private readonly IGameHighscoreService _gameHighscoreService;

        public GameHighscoreController(IGameHighscoreService gameHighscoreService)
        {
            _gameHighscoreService = gameHighscoreService;
        }

        [HttpGet("get-highscore-top")]
        public async Task<ActionResult<List<HighscoresTop>>> GetHighscoresTop(string gameId)
        {
            var topHighscores = await _gameHighscoreService.GetHighscoresTop(gameId);   

            if(topHighscores == null)
            {
                return NotFound("There is no highscore top for this game");
            }

            return Ok(topHighscores);
        }

        [HttpPost("save-score")]
        public async Task<ActionResult> SaveHighscore(string gameId, int userId, int score)
        {
            var savedScore = await _gameHighscoreService.SaveUserScore(gameId, userId, score);

            return savedScore.GetType() == typeof(string) ? BadRequest(savedScore) : Ok(savedScore);
        }
    }
}
