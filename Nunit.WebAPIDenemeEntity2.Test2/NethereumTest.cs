using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Nethereum.Web3;
using Nethereum.HdWallet;
using Nethereum.Contracts;


using NUnit.Framework;
using Newtonsoft.Json.Linq;
using System.IO;

namespace Nunit.WebAPIDenemeEntity2.Test
{
    public class NethereumTest 
    {
        private static string contractJsonPath;
        private static string contractAbi;
        private static string contractAddress;
        private static string chainUrl;
        private static string networkId;
        private static Contract mrfContract;

        [SetUp]
        public void Setup()
        {
            contractJsonPath = (@"C:\Users\eren_\Documents\demos\temp\webentity2fortruffle-2\WebAPIDenemeEntity2\truffle\client\src\contracts\MovieRankFactory.json");
            chainUrl = "HTTP://127.0.0.1:7545";
            networkId = "5777";

            JObject o1 = JObject.Parse(File.ReadAllText(contractJsonPath));
            contractAbi = o1["abi"].ToString();
            contractAddress = o1["networks"][networkId]["address"].ToString();

            var web3 = new Web3(chainUrl);
            mrfContract = web3.Eth.GetContract(contractAbi, contractAddress);
        }

    }
}
