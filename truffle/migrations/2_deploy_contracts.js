var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var MovieRank = artifacts.require("./MovieRank.sol");
var MovieRank_2 = artifacts.require("./MovieRank_2.sol");
var MovieRankFactory = artifacts.require("./MovieRankFactory.sol");
var SimpleStorage_2 = artifacts.require("./SimpleStorage_2.sol");

module.exports = async function(deployer) {
  await deployer.deploy(SimpleStorage);
  await deployer.deploy(MovieRank);
  await deployer.deploy(MovieRank_2);
  await deployer.deploy(MovieRankFactory);
  await deployer.deploy(SimpleStorage_2);
};
