create table "movie" (
    "id" BIGSERIAL NOT NULL PRIMARY KEY,
    "movieTitle" VARCHAR(150) NOT NULL,
    "releaseDate" DATE,
    "imdbRank" DECIMAL(3,1)
);

create table "director" (
    "id" BIGSERIAL NOT NULL PRIMARY KEY,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "dateOfBirth" DATE NOT NULL,
    "dateOfDeath" DATE,
    "SEX" SMALLINT NOT NULL, --ISO/IEC 5218 international standard 1=male, 2=female
    "spouse" VARCHAR(150)
);

create table "movieDirector" (
    "id" BIGSERIAL NOT NULL PRIMARY KEY,
    "movieId" BIGINT NOT NULL REFERENCES movie(id),
    "directorId" BIGINT NOT NULL REFERENCES director(id)
);

create table "genre" (
    "id" BIGSERIAL NOT NULL PRIMARY KEY,
    "genreName" VARCHAR(150) NOT NULL

);

create table "movieGenre" (
    "id" BIGSERIAL NOT NULL PRIMARY KEY,
    "movieId" BIGINT NOT NULL REFERENCES movie(id),
    "genreId" BIGINT NOT NULL REFERENCES genre(id)
);

create table "user" (
    "id" BIGSERIAL NOT NULL PRIMARY KEY,
    "userName" VARCHAR(100) NOT NULL,
    "pswSha" VARCHAR(64) NOT NULL,
    "permission" SMALLINT NOT NULL --1=admin, 2=user
);




insert into director("firstName", "lastName", "dateOfBirth", "SEX") values 
('Eren', 'Torun', date '2001-03-28', 1),        --1
('Quentin', 'Tarantino', date '1963-03-27', 1), --2
('David', 'Fincher', date '1962-08-28', 1);        --3

insert into genre ("genreName") values 
('Macera'),         --1
('Aksiyon'),        --2
('Dram'),           --3
('Komedi'),         --4
('Polisiye'),       --5
('Bilimkurgu'),     --6
('Biyografi');       --7

insert into "movie" ("movieTitle", "releaseDate", "imdbRank") values 
('Ucan Baliklar', date '2018-07-16', 8.3),       --1
('Pulp Fiction', date '1994-05-21', 8.9),        --2
('Django Unchained', date '2012-12-11', 8.4),    --3
('Fight Club', date '1999-09-21', 8.8),          --4
('The Social Network', date '2010-09-24', 7.7);  --5

insert into "movieGenre" ("movieId", "genreId") values 
(1,1),(1,4),(1,6),
(2,1),(2,2),(2,5),
(3,1),(3,3),
(4,1),(4,2),(4,5),
(5,3),(5,7);

insert into "movieDirector" ("movieId", "directorId") values (1,1), (2,2), (3,2), (4,3), (5,3);


--just test codes for copy paste

--select * from movie join movieGenre on movieGenre.movieId = movie.id join genre on genre.id = movieGenre.genreId where movie.id=3;

--select movieTitle, genreName from movie join movieGenre on movieGenre.movieId = movie.id join genre on genre.id = movieGenre.genreId where movie.id=3;

--select * from movie join movieGenre on movieGenre.movieId = movie.id join genre on genre.id = movieGenre.genreId 
--join movieDirector on movieDirector.movieId = movie.id join director on director.id = movieDirector.directorId;

--select * from movie join genre on genre.id = movieGenre.genreId;

--select * from movie join movieGenre on movieGenre.movieId = movie.id join genre on genre.id = movieGenre.genreId  join movieDirector on movieDirector.movieId = movie.id join director on director.id = movieDirector.directorId;

