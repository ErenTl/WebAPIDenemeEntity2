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

            JObject mrJson = JObject.Parse(File.ReadAllText(mrContractJsonPath));
            mrContractAbi = mrJson["abi"].ToString();

            web3 = new Web3(chainUrl);
            mrfContract = web3.Eth.GetContract(mrfContractAbi, mrfContractAddress);

            wallet = new Wallet("sell when around crowd joke perfect card wisdom trial aerobic dash shield", "");
        }

        [Test]
        public static async Task Rinkeby_GetAccountBalance_And_Transfer_Test()
        {
            var account = new Nethereum.Web3.Accounts.Account("d9c09ab9f9ea4eb37bff9c1a2bbdd4ae19109be4b86aad5a0085c1074da0b4ac");
            var web3 = new Web3(account, "https://rinkeby.infura.io/v3/5e6bf1b19daa4ea4afc5efb6afe1bb0f");

            var toAddress = "0x603E759D2b38b40Ef1Ad6Ae537733c3Cf1FA5946";

            var transaction = web3.Eth.GetEtherTransferService().TransferEtherAndWaitForReceiptAsync(toAddress, (decimal)0.001, 2);

            var balance = await web3.Eth.GetBalance.SendRequestAsync("0x66c2865772863d6e7482Acfc4117FE04749D9E08");
            var etherAmount = Web3.Convert.FromWei(balance.Value);

            Console.WriteLine(transaction.Result.TransactionHash);


            Console.WriteLine($"Balance in Ether: {etherAmount}");


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

        [Test]
        public async Task mr_newRanking_Test()
        {
            int movieId = 4;
            int rank = 10;
            int firstAverage;
            int finalAverage;
            int accountRank;

            var mrfGetMovieRank = mrfContract.GetFunction("getMovieRank");
            var mrfTask = mrfGetMovieRank.CallAsync<string>(movieId);
            var mrAddress = mrfTask.Result;

            var mrContract = web3.Eth.GetContract(mrContractAbi, mrAddress);
            firstAverage = mrContract.GetFunction("averageRank").CallAsync<int>().Result;

            var addressList = mrContract.GetFunction("getRankingAddressList").CallAsync<List<string>>().Result;

            Nethereum.Web3.Accounts.Account properAccount = null;
            for(int i=0; i< 10; i++)
            {
                if (!(addressList.Contains(wallet.GetAccount(i).Address)))
                {
                    properAccount = wallet.GetAccount(i);
                    Console.WriteLine("account number is " + i);
                    break;
                }
            }

            Console.WriteLine("account address is " + properAccount.Address);

            Web3 accountWeb3 = new Web3(properAccount, chainUrl);
            var accountMrContract = accountWeb3.Eth.GetContract(mrContractAbi, mrAddress);

            //for eth fee history problem
            accountWeb3.TransactionManager.UseLegacyAsDefault = true;



            var mrNewRanking = accountMrContract.GetFunction("newRanking").SendTransactionAndWaitForReceiptAsync(properAccount.Address ,new HexBigInteger(3000000), new HexBigInteger(0),null,rank)
                .ConfigureAwait(false)
                .GetAwaiter()
                .GetResult();

            finalAverage = mrContract.GetFunction("averageRank").CallAsync<int>().Result;
            accountRank  = mrContract.GetFunction("getRanking").CallAsync<int>(properAccount.Address).Result;

            Console.WriteLine("transaction hash is " + mrNewRanking.TransactionHash);
            Console.WriteLine("movie id " + movieId + "| rank: " + rank + "| first average rank: " + (double)firstAverage/10 + "| final average rank: " + (double)finalAverage/10);

            Assert.AreEqual(rank, accountRank);
        }
    }
}
