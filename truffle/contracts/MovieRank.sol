pragma solidity ^0.5.0;

import "@openzeppelin/upgrades-core/contracts/Initializable.sol";

contract MovieRank is Initializable {

    struct MovieRanking{
        bool isValid;
        uint8 rank;
    }
    
    string public movieName;
     mapping (address => MovieRanking) private ranking;
     address[] public rankingList;

    function initialize(string memory _movieName) public initializer {
        movieName = _movieName;
    }

    function getMovieName() public view returns(string memory) {
        return movieName;
    }

    function isValid(address _address) private view returns(bool) {
         return ranking[_address].isValid;
    }

    function getRankingCount() public view returns(uint) {
         return rankingList.length;
    }

    function newRanking(uint8 _rank) public returns(uint) {
        require(ranking[msg.sender].isValid==false && _rank >=0 && _rank <= 10);
        ranking[msg.sender].isValid = true;
        ranking[msg.sender].rank = _rank;
        return rankingList.push(msg.sender)-1;
    }

    function getRanking(address _address) public view returns(uint8) {
        return ranking[_address].rank;
    }

    function getRankingByIndex(uint _index) public view returns(uint8) {
        return getRanking(rankingList[_index]);
    }

    function getRankingAddressList() public view returns(address[] memory) {//oy veren adresleri döndürür
        return rankingList;
    }

    function getRankList() public view returns(uint8[] memory) {//rankingList adresleriyle aynı sırada puanları geri döndürür
        uint8[] memory temp = new uint8[](rankingList.length);
        for(uint i = 0; i < rankingList.length; i++) {
            temp[i] = getRanking(rankingList[i]);
        }
        return temp;
    }

    function averageRank() public view returns(uint) {
        if(getRankingCount()==0) return 0;
        else{
            uint s = 0;
            for(uint i=0; i<getRankingCount(); i++) {
                s = s + getRanking(rankingList[i]);
            }
            s = (s*10)/getRankingCount();
            return s; 
        }// 1 extra 0 || 35 means 3.5
    }

    

    

}