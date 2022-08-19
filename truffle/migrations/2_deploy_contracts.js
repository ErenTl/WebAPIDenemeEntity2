var CloneFactory = artifacts.require("./utils/CloneFactory.sol");
var Initializable = artifacts.require("./utils/Initializable.sol");
var MovieRank = artifacts.require("./MovieRank.sol");
//var MovieRank_2 = artifacts.require("./MovieRank_2.sol");
var MovieRankFactory = artifacts.require("./MovieRankFactory.sol");
//var SimpleStorage_2 = artifacts.require("./SimpleStorage_2.sol");
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
var atoken = artifacts.require("./Token/atoken.sol");
var atokenFactory = artifacts.require("./Token/atokenFactory.sol");

module.exports = async function(deployer) {
  //await deployer.deploy(SimpleStorage);
  await deployer.deploy(CloneFactory);
  //await deployer.deploy(Initializable);
  await deployer.deploy(MovieRank);
  await deployer.deploy(MovieRankFactory, MovieRank.address);
  await deployer.deploy(atoken);
  await deployer.deploy(atokenFactory, atoken.address);
};
