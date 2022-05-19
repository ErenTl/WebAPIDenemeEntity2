pragma solidity ^0.5.0;

import "./MovieRank.sol"; 

contract MovieRankFactory is MovieRank{

    MovieRank[] public movieRankArray;

    address owner = msg.sender;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() public { //movieRankArray'ın 0 indexi kodda çok fazla sıkıntıya sebep olduğu için kullanılmayan
        MovieRank movieRank = new MovieRank();//bir nesneyi array'e atadım
        movieRankArray.push(movieRank);
    }


    mapping (uint => uint) public movieIdtoIndex;
    uint[] public movieIdList;

    function createMovieRankContract(uint _movieId) public onlyOwner()  {
        require(movieIdtoIndex[_movieId]==0);
        MovieRank movieRank = new MovieRank();
        movieIdtoIndex[_movieId] = (movieRankArray.push(movieRank))-1;
        movieIdList.push(_movieId);
    }

    function getMovieRank(uint _movieId) public view returns(MovieRank) { //movie id den MovieRank kontratını getiriyor
        return MovieRank(address(movieRankArray[movieIdtoIndex[_movieId]]));
    }


    /*function mrfVote(uint _movieId, uint8 _rank) public returns(uint) {
        require(movieIdtoIndex[_movieId]!=0);

        return getMovieRank(_movieId).newRanking(_rank);
    }*/

    function mrfAverageRank(uint _movieId) public view returns(uint) {
        return getMovieRank(_movieId).averageRank();
    }

    function mrfGetRankingCount(uint _movieId) public view returns(uint) {
        return getMovieRank(_movieId).getRankingCount();
    }

    function mrfGetRankingByIndex(uint _movieId, uint _index) public view returns(uint) {
        return getMovieRank(_movieId).getRankingByIndex(_index);
    }

    function mrfGetRankingAdressesList(uint _movieId) public view returns(address[] memory) {
        return getMovieRank(_movieId).getRankingAddressList();
    }

    function mrfGetRankList(uint _movieId) public view returns(uint8[] memory) {
        return getMovieRank(_movieId).getRankList();
    }

    function getMovieIdList() public view returns(uint[] memory) {
        return movieIdList;
    }

    function getAllAverageRank() public view returns(uint[] memory) {//movieIdList'le eşli şekilde film ortalamalarını listeler
        uint[] memory temp = new uint[](movieIdList.length);
        for(uint i = 0; i < movieIdList.length; i++) {
            temp[i] = mrfAverageRank(movieIdList[i]);
        }
        return temp;
    }



    

    
   
    

}
