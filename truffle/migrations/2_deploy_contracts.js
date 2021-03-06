var CloneFactory = artifacts.require("./CloneFactory.sol");
//var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var MovieRank = artifacts.require("./MovieRank.sol");
//var MovieRank_2 = artifacts.require("./MovieRank_2.sol");
var MovieRankFactory = artifacts.require("./MovieRankFactory.sol");
//var SimpleStorage_2 = artifacts.require("./SimpleStorage_2.sol");

module.exports = async function(deployer) {
  //await deployer.deploy(SimpleStorage);
  await deployer.deploy(CloneFactory);
  await deployer.deploy(MovieRank);
  await deployer.deploy(MovieRankFactory, MovieRank.address);
};
