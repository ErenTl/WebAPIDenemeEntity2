pragma solidity ^0.5.0;

contract MovieRank{

    struct MovieRanking{
        bool isValid;
        uint8 rank;
    }


     mapping (address => MovieRanking) private ranking;
     address[] public rankingList;

     function isValid(address _address) private view returns(bool) {
         return ranking[_address].isValid;
     }

     function getRankingCount() private view returns(uint) {
         return rankingList.length;
     }

    function newRanking(uint8 _rank, address _sender) public   returns(uint) {
        require(ranking[_sender].isValid==false && _rank >=0 && _rank <= 10);
        ranking[_sender].isValid = true;
        ranking[_sender].rank = _rank;
        return rankingList.push(_sender)-1;
    }

    function getRanking(address _address) private view returns(uint) {
        return ranking[_address].rank;
    }

    function averageRank() public view returns(uint) {
        uint s = 0;
        for(uint i=0; i<getRankingCount(); i++) {
            s = s + getRanking(rankingList[i]);
        }
        s = (s*10)/getRankingCount();
        return s; // 1 extra 0 || 35 means 3.5
    }

    

}