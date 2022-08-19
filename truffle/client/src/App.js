import React, { Component } from "react";
import MovieRankFactoryContract from "./contracts/MovieRankFactory.json";
import MovieRankContract from "./contracts/MovieRank.json";
import getWeb3 from "./getWeb3";
import {Home} from "./Pages/Home";
import {Movie} from './Pages/Movie';
import {Director} from './Pages/Director';
import {Token} from './Pages/Token';
import {BrowserRouter, Route, Routes, NavLink} from 'react-router-dom';

import "./App.css";

class App extends Component {
  //state = { storageValue: 0, web3: null, accounts: null, contract: null, contract2:null, response:0 };

  componentDidMount = async () => {
    /*try {
      // Get network provider and web3 instance.
      console.log("waiting web3");
      const web3 = await getWeb3();
      console.log("done web3");
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      /*const deployedNetwork = MovieRankFactoryContract.networks[networkId];
      const instance = new web3.eth.Contract(
        MovieRankFactoryContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const deployedNetwork2 = MovieRankContract.networks[networkId];
      const instance2 = new web3.eth.Contract(
        MovieRankContract.abi,
        deployedNetwork2 && deployedNetwork2.address,
      );

      // Set web3, accounts, and contract to the state, and then pr
      this.setState({web3, accounts, contract2:instance2}, this.runExample);
      //this.setState({ web3, accounts, contract: instance }, this.runExample);
      //var res = await this.state.contract.methods.mrfAverageRank(5).call();
      var res = await this.state.contract2.methods.averageRank().call();
      console.log("res: " + res);
      this.setState({ storageValue: res });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }*/
  };

  /*runExample = async () => {
    const { accounts, contract, contract2, response } = this.state;

    // Stores a given value, 5 by default.
    console.log("runExample");
    
    console.log("list:");
    //var sd = await contract.methods.mrfAverageRank(5).call();
    //console.log(sd);
    console.log(accounts[0]);
    //await contract2.methods.newRanking(4).send({ from:accounts[0] });
    console.log("runExample done");
    // Get the value from the contract to prove it worked.
    //response = await contract2.methods.averageRank().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };*/

  render() {
    
    /*const { accounts, contract, contract2} = this.state;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }*/
    return (
      <>
      <BrowserRouter>
    <div className="App container">
      <h3 className='d-flex justify-content-center m-3'>
        Movie Project
      </h3>

      <nav className='navbar navbar-expand-sm bg-light navbar-dark'>

        <ul className='navbar-nav'>
          <li className='nav-item- m-1'>
            <NavLink className='btn btn-light btn-outline-primary' to='/home'>
              Home (Log In / Log Out)
            </NavLink>
          </li>
        </ul>

        <ul className='navbar-nav'>
          <li className='nav-item- m-1'>
            <NavLink className='btn btn-light btn-outline-primary'  
              to={{
                pathname:"/movie",
                state:{
                  deneme:"hadi olll"
                }
              }}end>
              Movie
            </NavLink>
          </li>
        </ul>

        <ul className='navbar-nav'>
          <li className='nav-item- m-1'>
            <NavLink className='btn btn-light btn-outline-primary'  to='/director'>
              Director
            </NavLink>
          </li>
        </ul>
        
        <ul className='navbar-nav'>
          <li className='nav-item- m-1'>
            <NavLink className='btn btn-light btn-outline-primary'  to='/token'>
              Token
            </NavLink>
          </li>
        </ul>

      </nav>

      <Routes>
          <Route path="/home"  element={<Home />} />
          <Route end path="/movie" element={<Movie />} />
          <Route path="/director" element={<Director />} />
          <Route path="/token" element={<Token />} />
      </Routes>
      
    </div>
    </BrowserRouter>
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {/*this.state.storageValue*/}</div>
        <button type="button" className='btn btn-primary m-2 float-end' onClick={()=>{
          //contract2.methods.newRanking(2).send({ from:accounts[0] });
        }}>Send</button> 
        <button type="button" className='btn btn-primary m-2 float-end' onClick={()=>{
          //var temp = this.state.contract2.methods.averageRank().call();
          //console.log(temp);
        }}>Call</button> 
      </div>
      </>
    );
  }
}

export default App;
