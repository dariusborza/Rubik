using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RubikApi.Models;

namespace RubikApi.DatabaseSettings
{
    public partial class RubikDBContext : DbContext
    {   
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Score> Score { get; set; }
        public virtual DbSet<Game> Games { get; set; }
        public virtual DbSet<GameHighscore> GamesHighscores { get; set; }

        public virtual DbSet<Review> Reviews {  get; set; }
        public virtual DbSet<UserToken> Tokens { get; set; }
        public RubikDBContext(DbContextOptions<RubikDBContext>options) : base(options)
        {
            
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Email)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Password)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Nickname)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.SecretAnswer)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.ProfilePicturePath)
                    .HasMaxLength(100)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Score>(entity =>
            {
                entity.ToTable("Score");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Highscore)
                    .HasColumnType("integer");

                entity.HasOne(e => e.User)
                    .WithOne(e => e.Score)
                    .HasForeignKey<Score>(e => e.UserId)
                    .IsRequired(false);
            });

            modelBuilder.Entity<Game>(entity =>
            {
                entity.ToTable("Game");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasMany<GameHighscore>()
                    .WithOne(e => e.Game)
                    .HasForeignKey(e => e.GameId);

                entity.HasMany<Review>()
                    .WithOne(e => e.Game)
                    .HasForeignKey(e => e.GameId);
            });

            modelBuilder.Entity<GameHighscore>(entity =>
            {
                entity.ToTable("GameHighscore");

                entity.HasKey(e => new { e.UserId, e.GameId });

                entity.Property(e => e.Score)
                    .HasColumnType("integer");

                entity.HasOne<User>(e => e.User)
                    .WithMany(e => e.GamesHighScores)
                    .HasForeignKey(e => e.UserId);

                entity.HasOne<Game>(e => e.Game)
                    .WithMany(e => e.GamesHighScores)
                    .HasForeignKey(e => e.GameId);
            });


            modelBuilder.Entity<Review>(entity =>
            {
                entity.ToTable("Review");

                entity.HasKey(e => new { e.UserId, e.GameId });

                entity.Property(e => e.ReviewText)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.HasOne<User>(e => e.User)
                    .WithMany(e => e.Reviews)
                    .HasForeignKey(e => e.UserId);

                entity.HasOne<Game>(e => e.Game)
                    .WithMany(e => e.Reviews)
                    .HasForeignKey(e => e.GameId);
            });

            modelBuilder.Entity<UserToken>(entity =>
            {
                entity.ToTable("UserToken");

                entity.Property(e => e.RefreshToken)
                        .HasMaxLength(50)
                        .IsUnicode(false);
                entity.Property(e => e.RefreshTokenExpiryTime)
                        .HasColumnType("datetime");

                entity.HasOne(e => e.User)
                        .WithMany(u => u.UserTokens)
                        .HasForeignKey(u => u.UserId)
                        .OnDelete(DeleteBehavior.ClientSetNull);
            });
        }
    }
}
