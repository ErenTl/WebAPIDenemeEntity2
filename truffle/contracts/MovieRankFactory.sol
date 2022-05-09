pragma solidity ^0.5.0;

import "./MovieRank.sol"; 

contract MovieRankFactory is MovieRank{

    MovieRank[] public movieRankArray;

     constructor() public { //movieRankArray'ın 0 indexi kodda çok fazla sıkıntıya sebep olduğu için kullanılmayan
        MovieRank movieRank = new MovieRank();//bir nesneyi array'e atadım
        movieRankArray.push(movieRank);
     }


    mapping (uint => uint) public movieIdtoIndex;

    function createMovieRankContract(uint _movieId) public{
        MovieRank movieRank = new MovieRank();
        movieIdtoIndex[_movieId] = (movieRankArray.push(movieRank))-1;
    }

    function getMovieRank(uint _movieId) public view returns(MovieRank) {
        return MovieRank(address(movieRankArray[movieIdtoIndex[_movieId]]));
    }


    function mrfVote(uint _movieId, uint8 _rank) public returns(uint) {
        if(movieIdtoIndex[_movieId]==0 ) {
            createMovieRankContract(_movieId);
        }

        return MovieRank(address(movieRankArray[movieIdtoIndex[_movieId]])).newRanking(_rank, msg.sender);
    }

    function mrfAverageRank(uint _movieId) public view returns(uint) {
        return getMovieRank(_movieId).averageRank();
    }

    
   
    

}
