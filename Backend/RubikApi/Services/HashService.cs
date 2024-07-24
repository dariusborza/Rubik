using System.Security.Cryptography;

namespace RubikApi.Services
{
    public static class HashService
    {
        //convertire parola in bytes
        public static string CreateHash(string input)
        {
            using (MD5 md5 = MD5.Create())
            {
                byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);

                return Convert.ToHexString(hashBytes);
            }
        }
    }
}
