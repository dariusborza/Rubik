using Microsoft.EntityFrameworkCore;
using RubikApi.DatabaseSettings;
using RubikApi.Models;

namespace RubikApi.Services
{
    public class HomeTopService : IHomeTopService
    {
        private readonly RubikDBContext _dbContext;
        public HomeTopService(RubikDBContext dBContext) { 
            _dbContext = dBContext;
        }


        public async Task<List<User>> GetAllUsers()
        {
            var users = await _dbContext.Users.ToListAsync();

            return users;
        }

        public async Task<List<MyProfileUser>> GetHomeTopUsers()
        {
            var topUsers = new List<MyProfileUser>();
            var users = await GetAllUsers();

            foreach (var user in users)
            {
                var level = await _dbContext.Score.FirstOrDefaultAsync(s => s.UserId == user.Id);
                topUsers.Add(new MyProfileUser(user.Nickname, level !=null ? level.Highscore : 0, user.ProfilePicturePath));
            }

            topUsers.Sort((x, y) => y.Level.CompareTo(x.Level));

            return topUsers;
        }
    }
}
