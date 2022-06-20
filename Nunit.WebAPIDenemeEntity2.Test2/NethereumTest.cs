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
using System.Runtime.Serialization;
using Nethereum.Hex.HexTypes;

namespace Nunit.WebAPIDenemeEntity2.Test
{
    public class NethereumTest 
    {
        private static string mrfContractJsonPath;
        private static string mrfContractAbi;
        private static string mrfContractAddress;

        private static string mrContractJsonPath;
        private static string mrContractAbi;


        private static string chainUrl;
        private static string networkId;
        private static Web3 web3;
        private static Contract mrfContract;
        private Wallet wallet;

        [SetUp]
        public void Setup()
        {
            mrfContractJsonPath = (@"C:\Users\eren_\Documents\demos\temp\webentity2fortruffle-2\WebAPIDenemeEntity2\truffle\client\src\contracts\MovieRankFactory.json");
            mrContractJsonPath = (@"C:\Users\eren_\Documents\demos\temp\webentity2fortruffle-2\WebAPIDenemeEntity2\truffle\client\src\contracts\MovieRank.json");

            chainUrl = "HTTP://127.0.0.1:7545";
            networkId = "5777";

            JObject o1 = JObject.Parse(File.ReadAllText(mrfContractJsonPath));
            mrfContractAbi = o1["abi"].ToString();
            mrfContractAddress = o1["networks"][networkId]["address"].ToString();

            var web3 = new Web3(chainUrl);
            mrfContract = web3.Eth.GetContract(mrfContractAbi, mrfContractAddress);

            wallet = new Wallet("sell when around crowd joke perfect card wisdom trial aerobic dash shield", "");
        }


        [Test]
        public static async Task mrfAverageRank_Test()
        {
            int movieId = 2;

            var getMrfAverageRankContract = mrfContract.GetFunction("mrfAverageRank");
            var task =  getMrfAverageRankContract.CallAsync<int>(movieId);
            int fact = task.Result;

            Console.WriteLine("id " + movieId + " movie's average rank is: " + ((double)fact/10) + "/10");
            Assert.IsTrue(fact >= 0 && fact <= 100);
        }

        [Test]
        public async Task mrfGetRankingCount_Test()
        {
            int movieId = 13;

            var getMrfGetRankingCount = mrfContract.GetFunction("mrfGetRankingCount");
            var task = getMrfGetRankingCount.CallAsync<int>(movieId);
            int fact = task.Result;

            Console.WriteLine("id " + movieId + " movie is voted for " + (fact) + " times");
            Assert.IsTrue(fact >= 0);
        }
    }
}
