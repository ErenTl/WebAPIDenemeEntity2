using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace WebAPIDenemeEntity2.Models
{
    public partial class MovieDBContext : DbContext
    {
        public MovieDBContext()
        {
        }

        public MovieDBContext(DbContextOptions<MovieDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Director> Directors { get; set; } = null!;
        public virtual DbSet<Genre> Genres { get; set; } = null!;
        public virtual DbSet<Movie> Movies { get; set; } = null!;
        public virtual DbSet<MovieDirector> MovieDirectors { get; set; } = null!;
        public virtual DbSet<MovieGenre> MovieGenres { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                //warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseNpgsql("Server=localhost;Port=5432;Database=moviedb;User Id=postgres;Password=dbpass;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Director>(entity =>
            {
                entity.ToTable("director");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.DateOfBirth).HasColumnName("dateOfBirth");

                entity.Property(e => e.DateOfDeath).HasColumnName("dateOfDeath");

                entity.Property(e => e.FirstName)
                    .HasMaxLength(100)
                    .HasColumnName("firstName");

                entity.Property(e => e.LastName)
                    .HasMaxLength(100)
                    .HasColumnName("lastName");

                entity.Property(e => e.Sex).HasColumnName("SEX");

                entity.Property(e => e.Spouse)
                    .HasMaxLength(150)
                    .HasColumnName("spouse");
            });

            modelBuilder.Entity<Genre>(entity =>
            {
                entity.ToTable("genre");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.GenreName)
                    .HasMaxLength(150)
                    .HasColumnName("genreName");
            });

            modelBuilder.Entity<Movie>(entity =>
            {
                entity.ToTable("movie");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.ImdbRank)
                    .HasPrecision(3, 1)
                    .HasColumnName("imdbRank");

                entity.Property(e => e.MovieTitle)
                    .HasMaxLength(150)
                    .HasColumnName("movieTitle");

                entity.Property(e => e.ReleaseDate).HasColumnName("releaseDate");
            });

            modelBuilder.Entity<MovieDirector>(entity =>
            {
                entity.ToTable("movieDirector");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.DirectorId).HasColumnName("directorId");

                entity.Property(e => e.MovieId).HasColumnName("movieId");

                entity.HasOne(d => d.Director)
                    .WithMany(p => p.MovieDirectors)
                    .HasForeignKey(d => d.DirectorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("movieDirector_directorId_fkey");

                entity.HasOne(d => d.Movie)
                    .WithMany(p => p.MovieDirectors)
                    .HasForeignKey(d => d.MovieId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("movieDirector_movieId_fkey");
            });

            modelBuilder.Entity<MovieGenre>(entity =>
            {
                entity.ToTable("movieGenre");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.GenreId).HasColumnName("genreId");

                entity.Property(e => e.MovieId).HasColumnName("movieId");

                entity.HasOne(d => d.Genre)
                    .WithMany(p => p.MovieGenres)
                    .HasForeignKey(d => d.GenreId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("movieGenre_genreId_fkey");

                entity.HasOne(d => d.Movie)
                    .WithMany(p => p.MovieGenres)
                    .HasForeignKey(d => d.MovieId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("movieGenre_movieId_fkey");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
