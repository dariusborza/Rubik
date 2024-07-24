namespace RubikApi.Models
{
    public class MyProfileUser
    {
        public string Nickname { get; set; }    
        public int Level { get; set; }

        public string ProfilePicturePath { get; set; }

        public MyProfileUser() { }
        public MyProfileUser(string nickname, int level, string profilePicturePath)
        {
            Nickname = nickname;
            Level = level;
            ProfilePicturePath = profilePicturePath;

        }
    }
}
