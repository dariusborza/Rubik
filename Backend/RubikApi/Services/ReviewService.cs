using Microsoft.EntityFrameworkCore;
using RubikApi.DatabaseSettings;
using RubikApi.Models;

//var users = await _registerService.GetAllUsers();

//var reviews = new List<ReviewInfo>();

//foreach (var user in users)
//{
//    var review = await GetReview(gameId, user.Id);
//    if (review != null)
//    {
//        reviews.Add(new ReviewInfo
//        {
//            Nickname = user.Nickname,
//            Review = review.ReviewText
//        });
//    }
//}
namespace RubikApi.Services
{
    public class ReviewService : IReviewService
    {
        private readonly RubikDBContext _dbContext;
        private readonly IRegisterService _registerService;

        public ReviewService(RubikDBContext dbContext, IRegisterService registerService) 
        {
            _dbContext = dbContext;
            _registerService = registerService;
        }

        public async Task<object> SaveUserReview(string gameId, int userId, string reviewText)
        {
            if (string.IsNullOrWhiteSpace(reviewText))
            {
                return "Empty review";
            }

            var review = new Review
            {
                GameId = gameId,
                UserId = userId,
                ReviewText = reviewText
            };

            _dbContext.Reviews.Add(review);
            await _dbContext.SaveChangesAsync();

            return review;
        }

        public async Task<List<ReviewInfo>> GetReviews(string gameId)
        {
            var reviews = await _dbContext.Reviews.Where(r => r.GameId == gameId).ToListAsync();
            var reviewsInfo = new List<ReviewInfo>();

            foreach (var review in reviews)
            {
                var user = await _registerService.GetUserById((int)review.UserId);
                reviewsInfo.Add(new ReviewInfo
                {
                    Nickname = user.Nickname,
                    Review = review.ReviewText
                });
            }

            return reviewsInfo;
        }


        public async Task<Review?> GetReview(string gameId, int userId)
        {
            var review = await _dbContext.Reviews.FirstOrDefaultAsync(s => s.GameId == gameId && s.UserId == userId);

            if (review == null)
            {
                return null;
            }

            return review;
        }

    }
}
