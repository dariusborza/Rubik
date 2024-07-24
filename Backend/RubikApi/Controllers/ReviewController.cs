using Microsoft.AspNetCore.Mvc;
using RubikApi.Models;
using RubikApi.Services;

namespace RubikApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReviewController : Controller
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet("get-all-reviews")]
        public async Task<ActionResult<List<ReviewInfo>>> GetAllReviews(string gameId)
        {
            var reviews = await _reviewService.GetReviews(gameId);

            if (reviews == null)
            {
                return NotFound("There is no review for this game");
            }

            return Ok(reviews);
        }

        [HttpPost("save-review")]
        public async Task<ActionResult> SaveReview(string gameId, int userId, string reviewText)
        {
            var savedReview = await _reviewService.SaveUserReview(gameId, userId, reviewText);

            return savedReview.GetType() == typeof(string) ? BadRequest(savedReview) : Ok(savedReview);
        }
    }
}
