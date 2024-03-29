const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  compilers: {
    solc: {
      version: "0.8.15"
    }
  },
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 7545,
      gas:3000000000,
      network_id: "5777",
      chain_id: "1337"
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      gas:3000000000,
      network_id: "5777"
    }
  }
};
