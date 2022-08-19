import React,{Component} from 'react';
import getWeb3 from "../getWeb3";

import atokenContract from "../contracts/atoken.json";
import atokenFactoryContract from "../contracts/atokenFactory.json";

export class Token extends Component{
    constructor(props) {
        super(props);

        this.state={
            web3bool:false,
            web3:null,
            accounts:null,
            atokenFactoryContract:null,
            networkId:null,

            _tokenUriPrefix:null,
            _name:null,
            _symbol:null,
            _maximumRoyaltyRate:null,
            _serverId:null,

            tokenId:null,
            tokenAmount:null,

            _serverIdMint:null,
            tokenIdMint:null,
            tokenAmountMint:null,

            collectionList:[],
            collectionNameList:[],
            collectionUriList:[],
            createHash:[]

        }
    }

    async componentDidMount() {
        try{
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();

            const atokenFactoryDeployedNetwork = atokenFactoryContract.networks[networkId];
            const atokenFactoryInstance = new web3.eth.Contract(atokenFactoryContract.abi, 
                atokenFactoryDeployedNetwork && atokenFactoryDeployedNetwork.address);

            await this.setState({networkId:networkId, web3, accounts, atokenFactoryContract: atokenFactoryInstance, web3bool:true });
            console.log("atoken address: ");
            console.log(atokenContract.networks[networkId].address);
            
            this.refreshList();

        }catch(e) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
              );
        }
    }

    async refreshList() {
        this.listCollections();
    }

    change_tokenUriPrefix = (e) => {
        this.setState({_tokenUriPrefix:e.target.value});
    }

    change_name = (e) => {
        this.setState({_name:e.target.value});
    }

    change_symbol = (e) => {
        this.setState({_symbol:e.target.value});
    }

    change_maximumRoyaltyRate = (e) => {
        this.setState({_maximumRoyaltyRate:e.target.value});
    }

    change_serverId = (e) => {
        this.setState({_serverId:e.target.value});
    }

    changeTokenId = (e) => {
        this.setState({tokenId:e.target.value});
    }

    changeTokenAmount = (e) => {
        this.setState({tokenAmount:e.target.value});
    }

    change_serverIdMint = (e) => {
        this.setState({_serverIdMint:e.target.value});
    }

    changeTokenIdMint = (e) => {
        this.setState({tokenIdMint:e.target.value});
    }

    changeTokenAmountMint = (e) => {
        this.setState({tokenAmountMint:e.target.value});
    }



    async atokenFactoryCreateContract() {
        var id =await this.state.atokenFactoryContract.methods
                .createCollection(this.state._tokenUriPrefix, this.state._name, this.state._symbol, this.state._maximumRoyaltyRate)
                .send({from:this.state.accounts[0]});
        this.setState({createHash:id});
        console.log("id: " + id.events.returnCollectionIdAndAddress.returnValues.collectionId + "| address: " + id.events.returnCollectionIdAndAddress.returnValues.collectionAddress);
        this.refreshList();
    }

    async atokenMint() {
        var proxyAddress = await this.state.atokenFactoryContract.methods.getCollectionAddress(this.state._serverIdMint).call();
        const atokenDeployedNetwork = atokenContract.networks[this.state.networkId];
        const atokenInstance = new this.state.web3.eth.Contract(atokenContract.abi, 
            atokenDeployedNetwork && proxyAddress);

        await atokenInstance.methods.mint(this.state.accounts[0], this.state.tokenIdMint, this.state.tokenAmountMint, 0 ,"", []).send({from:this.state.accounts[0]});
    }

    async balanceOfToken() {
        var proxyAddress = await this.state.atokenFactoryContract.methods.getCollectionAddress(this.state._serverIdMint).call();
        const atokenDeployedNetwork = atokenContract.networks[this.state.networkId];
        const atokenInstance = new this.state.web3.eth.Contract(atokenContract.abi, 
            atokenDeployedNetwork && proxyAddress);

        var balance = await atokenInstance.methods.balanceOf(this.state.accounts[0], this.state.tokenIdMint).call();
        console.log("balance: " + balance);

        var test = await atokenInstance.methods.getTest().call();
        console.log("test: " + test);

        
    }

    async listCollections() {
        var collections = await this.state.atokenFactoryContract.methods.getCollectionList().call();
        this.setState({collectionList:collections});

        var namelisttest = await this.state.atokenFactoryContract.methods.getCollectionNameList().call();
        this.setState({collectionNameList:namelisttest});

        var uriList = await this.state.atokenFactoryContract.methods.getCollectionUriList().call();
        this.setState({collectionUriList:uriList});

    }

    render() {
        const {
            _tokenUriPrefix,
            _name,
            _symbol,
            _maximumRoyaltyRate,
            _serverId,

            tokenId,
            tokenAmount,

            _serverIdMint,
            tokenIdMint,
            tokenAmountMint,

            collectionList,
            collectionNameList,
            collectionUriList
        }=this.state;

        return(
            <div className='modal-dialog modal-lg'>
                    <div className='modal-md modal-dialog-centered'>
                        <div className='modal-content '>
                            <div className='modal-header'>
                                <h5 className='modal-title'>{"createCollection"}</h5>
                            </div>
                            <div className='modal-body'>
                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>string memory _tokenUriPrefix</span>
                                    <input type="text" className='form-control'
                                        value={_tokenUriPrefix}
                                        onChange={this.change_tokenUriPrefix}>
                                    </input>
                                </div>
                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>string memory _name</span>
                                    <input type="text" className='form-control'
                                        value={_name}
                                        onChange={this.change_name}>
                                    </input>
                                </div>
                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>string memory _symbol</span>
                                    <input type="text" className='form-control'
                                        value={_symbol}
                                        onChange={this.change_symbol}>
                                    </input>
                                </div>
                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>uint256 _maximumRoyaltyRate</span>
                                    <input type="text" className='form-control'
                                        value={_maximumRoyaltyRate}
                                        onChange={this.change_maximumRoyaltyRate}>
                                    </input>
                                </div>
                                
                            </div>
                            <button type='button' className='btn btn-primary float-start' onClick={()=>this.atokenFactoryCreateContract()} >
                                Send 
                            </button>        
                        </div>

                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>{"Mint"}</h5>
                            </div>
                            <div className='modal-body'>
                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>uint32 collectionId</span>
                                    <input type="text" className='form-control'
                                        value={_serverIdMint}
                                        onChange={this.change_serverIdMint}>
                                    </input>
                                </div>
                                <div className='input-group mb-3'></div>
                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>uint256 id</span>
                                    <input type="text" className='form-control'
                                        value={tokenIdMint}
                                        onChange={this.changeTokenIdMint}>
                                    </input>
                                </div>
                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>uint256 amount</span>
                                    <input type="text" className='form-control'
                                        value={tokenAmountMint}
                                        onChange={this.changeTokenAmountMint}>
                                    </input>
                                </div>
                                <button type='button' className='btn btn-primary float-start' onClick={()=>this.balanceOfToken()} >
                                    Balance 
                                </button>           
                                <button type='button' className='btn btn-primary float-start' onClick={()=>this.listCollections()} >
                                    Collection 
                                </button>  
                            </div>
                            <button type='button' className='btn btn-primary float-start' onClick={()=>this.atokenMint()} >
                                Send 
                            </button>  
                        </div>
                    </div>


                    <table className='table table-striped'>

                        <thead>
                            <tr>
                                <th>
                                    Collection Id
                                </th>
                                <th>
                                    Collection Address
                                </th>
                                <th>
                                    Collection Name
                                </th>
                                <th>
                                    Collection URI
                                </th>
                                <th>
                                    
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                             {Object.keys(collectionList).map(col => 
                                <tr key={col} className="flex-row">
                                    <td>{(parseInt(col)+1)}</td>
                                    <td>{collectionList[col]}</td>
                                    <td>{collectionNameList[col]}</td>
                                    <td>{collectionUriList[col]}</td>
                                    <td className='col-2'>
                                        <button type="button" className='btn btn-primary float-end'
                                            data-bs-toggle="modal" data-bs-target="#dirModal">
                                            Görüntüle
                                        </button>
                                    </td>
                                </tr>    
                            )}
                        </tbody>

                    </table>


                </div>
        )
    }

}