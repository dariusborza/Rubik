using RubikApi.Models;

namespace RubikApi.Services
{
    public interface IReviewService
    {
        Task<object> SaveUserReview(string gameId, int userId, string reviewText);
        Task<List<ReviewInfo>> GetReviews(string gameId);
        Task<Review?> GetReview(string gameId, int userId);
    }
}
