import React,{Component} from 'react';
import { mockComponent } from 'react-dom/test-utils';
import {variables} from '../Variables.js';
import { useLocation} from "react-router-dom"

import getWeb3 from "../getWeb3";
import MovieRankFactoryContract from "../contracts/MovieRankFactory.json";
import MovieRankContract from "../contracts/MovieRank.json";

export class Movie extends Component{

    constructor(props) {
        super(props);


        this.state={
            movies:[],
            modalTitle:"",
            MovieName:"",
            MovieId:0,

            directorList:[],
            directorDirect:[],

            MovieIdFilter:"",
            MovieNameFilter:"",
            moviesWithoutFilter:[],
            DropDirectorNameFilter:[],

            mdId:[],
            loginBool:false,

            web3bool:false,
            web3:null,
            accounts:null,
            mrfContract:null,
            networkId:null,

            bcMovieIdList:[],
            bcMovieRankList:[],
            BCMovieRank:0,
            mrContract:null,
            bcVoteBool:false,
            bcRankNow:0


        }
    }


    async componentDidMount() {

        try{
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();

            const mrfDeployedNetwork = MovieRankFactoryContract.networks[networkId];
            const mrfInstance = new web3.eth.Contract(MovieRankFactoryContract.abi,
                mrfDeployedNetwork && mrfDeployedNetwork.address);

            // Set web3, accounts, and contract to the state
            this.setState({networkId:networkId, web3, accounts, mrfContract: mrfInstance, web3bool:true });
        }catch(e){
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
              );
        }


        this.refreshList();
        this.setLoginBool();
        this.getBCMovieIdList();
        this.bcGetAllRanks();
        
    }

    async getBCMovieIdList() {
        var temp = await this.state.mrfContract.methods.getMovieIdList().call();
        this.setState({bcMovieIdList:temp});
    }

    async bcCreateMRContract(mov) {
        await this.state.mrfContract.methods.createMovieRankContract(mov.id).send({from:this.state.accounts[0],gas:3000000});
        window.location.reload(false);
    }

    async bcMovieVoteClick(id) {
        //filmin id si ile filmin kontratının adresini factory kontratından çekiyoruz
        var address = await this.state.mrfContract.methods.getMovieRank(id).call();

        //filmin kontratını tanımlıyoruz ve state'imize aktarıyoruz
        var tempContract = new this.state.web3.eth.Contract(MovieRankContract.abi, address);
        this.setState({mrContract:tempContract});

        //kontratta oy kullanmış cüzdan adreslerini çekiyoruz
        var addressList = await tempContract.methods.getRankingAddressList().call();

        var rank = await tempContract.methods.averageRank().call();
        this.setState({bcRankNow:rank});

        if(addressList.includes(this.state.accounts[0])){
            this.setState({bcVoteBool:true});
        }else{
            this.setState({bcVoteBool:false});
        }
    }

    async bcMovieVote(id) {
        

        await this.state.mrContract.methods.newRanking(this.state.BCMovieRank).send({from:this.state.accounts[0],gas:3000000});
        await console.log(this.state.mrContract.methods.averageRank().call());

    }

    async bcGetAllRanks() {
        var bcMovieRankList = await this.state.mrfContract.methods.getAllAverageRank().call();
        this.setState({bcMovieRankList:bcMovieRankList});
    }

    

    setLoginBool() {
        if(localStorage.getItem('user')!=null)  {
            this.setState({loginBool:true});
        }else {
            this.setState({loginBool:false});
        }
    }

    FilterFn() {
        var MovieIdFilter = this.state.MovieIdFilter;
        var MovieNameFilter = this.state.MovieNameFilter;

        
        var filteredData=this.state.moviesWithoutFilter.filter(
            function(el){
                return (el.id.toString().toLowerCase().includes(
                    MovieIdFilter.toString().trim().toLowerCase()
                )&&
                el.movieTitle.toString().toLowerCase().includes(
                    MovieNameFilter.toString().trim().toLowerCase()
                ))
            }
        );

        this.setState({movies:filteredData});
    }

    sortResult(prop, asc) {
        var sortedData = this.state.moviesWithoutFilter.sort(function(a,b) {
            if(asc) {
                return (a[prop]>b[prop])?1:((a[prop]<b[prop])?-1:0);
            } else {
                return (b[prop]>a[prop])?1:((b[prop]<a[prop])?-1:0);
            }
        });

        this.setState({movies:sortedData});
    }

    changeMovieIdFilter = (e) => {
        this.state.MovieIdFilter=e.target.value;
        this.FilterFn();
    }

    changeMovieNameFilter = (e) => {
        this.state.MovieNameFilter=e.target.value;
        this.FilterFn();
    }

    

    refreshList() {
        fetch(variables.API_URL+'movie' , {
            headers: {
                'Accept': 'application/json'
            }
        }) 
        .then(response => response.json())
        .then(data=> {
            this.setState({movies:data, moviesWithoutFilter:data});
        });
        this.getDirectors();
        if(!(this.state.MovieId==0)){
            this.getDirector(this.state.MovieId);
        }
        
        
    }

    getDirector(id) {
        fetch(variables.API_URL+'movie/GetMovieDetails/'+id, {
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            this.setState({directors:data});
            this.setState({directorDirect:data.movieDirectors});
            var md_lenth = data.movieDirectors.length;

            console.log("length: "+md_lenth);
            
            var temp = Array(md_lenth);
            for (let index = 0; index < md_lenth; index++) {
               temp[index]= data.movieDirectors[index].director.firstName + " " +  data.movieDirectors[index].director.lastName;

            }
            this.setState({DropDirectorNameFilter:temp});
            console.log("data: "+data);
        });
    }

    getDirectors() {
        fetch(variables.API_URL+'directors' , {
            headers:{
                'Accept': 'application-json'
            }
        })
        .then(res => res.json())
        .then(data => {
            this.setState({directorList:data});
        });
    }


    

    changeMovieName =(e)=>{
        this.setState({MovieName:e.target.value});
    }

    changeMovieReleaseDate =(e)=>{
        this.setState({MovieReleaseDate:e.target.value});
    }

    changeMovieImdbRank =(e)=>{
        this.setState({MovieIMDBRank:e.target.value});
    }
    changeBCMovieRank = (e) => {
        this.setState({BCMovieRank:e.target.value});
    }

    addClick() {
        console.log("addclick");
        this.setState({
            modalTitle:"Add Movie",
            MovieName:"",
            MovieReleaseDate:"",
            MovieIMDBRank:"",
            MovieId:0,
            DropDirectorNameFilter:["Select Director"],
            mdId:[]
        });
    }

    increaseDropDirector() {
        var temp = this.state.DropDirectorNameFilter;
        temp.push("Select Director");
        this.setState({DropDirectorNameFilter:temp});
    }

    async decreaseDropDirector(id) {
        

        console.log("MDID: " + this.state.directors.movieDirectors[id].id);
        var options = {
            method: 'DELETE',
            headers:{
                'Content-Type':'application/json'
            }
        }
        await fetch(variables.API_URL+'MovieDirectors/'+this.state.directors.movieDirectors[id].id, options);
        this.refreshList();

        var temp = this.state.DropDirectorNameFilter;
        temp.splice(id,1);
        this.setState({DropDirectorNameFilter:temp});

        var temp_md = this.state.mdId;
        temp_md.splice(id,1);
        this.setState({mdId:temp_md});

    }

    editClick(mov) {
        console.log("editclick");
        this.getDirector(mov.id);
        this.setState({
            modalTitle:"Edit Movie",
            MovieName:mov.movieTitle,
            MovieId:mov.id,
            MovieReleaseDate:mov.releaseDate,
            MovieIMDBRank:mov.imdbRank
        });
        this.getDirectors();
        console.log("edit");
        
    }


    //creates movie with post movie and directors
    async createClick() {
        var result_id;
        var options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).accessToken
            },
            body:JSON.stringify({
                movieTitle:this.state.MovieName,
                releaseDate:this.state.MovieReleaseDate,
                imdbRank:this.state.MovieIMDBRank
            })
        }
        await fetch(variables.API_URL+'movie/', options )
        .then(res=>res.json())
        .then((res)=>{
            result_id = res[0].id;
            alert("Movie added successfully");
            this.refreshList();
        }, (error)=>{
            alert(error);
        });

        Object.keys(this.state.mdId).map(md => {
            var options_2 = {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).accessToken
                },
                body:JSON.stringify({
                    movieId:result_id,
                    directorId:this.state.mdId[md]
                })
            }
            fetch(variables.API_URL+'MovieDirectors/', options_2 )
            .then(res=>res.json())
            .then((result)=>{
                this.refreshList();
            }, (error)=>{
                alert(error);
            });
        });

    }

    


    //updates movie with put movie and directors -- bugs in director section will be fixed.
    updateClick(id) {
        var options = {
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).accessToken
            },
            body:JSON.stringify({
                movieTitle:this.state.MovieName,
                releaseDate:this.state.MovieReleaseDate,
                imdbRank:this.state.MovieIMDBRank
            })
        }

        fetch(variables.API_URL+'movie/'+id, options)
        .then(res=>res.json())
        .then((result)=>{
            alert("Film başarıyla güncellendi");
        }, (error)=>{
            alert(error);
        });

        Object.keys(this.state.directors.movieDirectors).map(md => {
            var options2 = {
                method:'PUT',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).accessToken
                },
                body:JSON.stringify({
                    movieId:id,
                    directorId:this.state.directors.movieDirectors[md].directorId
                })
            }
    
            fetch(variables.API_URL+'MovieDirectors/'+this.state.mdId[md], options2)
            .then(res=>res.json())
            .then((result)=> {
                this.refreshList();
            }, (error) => {
                alert(error);
            });
        });

        

        
        this.getDirectors();

    

    }

    deleteClick(id) {
        var options = {
            method: 'DELETE',
            headers:{
                'Authorization': "Bearer " + JSON.parse(localStorage.getItem('user')).accessToken
            }
        }

        fetch(variables.API_URL+'movie/'+id, options)
        .then(res=>res.json())
        .then((result)=>{
            alert("Silme işlemi başarılı");
            this.refreshList();
        }, (error)=>{
            alert(error);
        });

    }

   
    render() {
        const {
            movies,
            modalTitle,
            MovieName,
            MovieId,
            MovieReleaseDate,
            MovieIMDBRank,
            directorList,
            loginBool,
            directors,
            directorDirect,
            BCMovieRank,
            bcVoteBool,
            bcRankNow,
            bcMovieIdList,
            bcMovieRankList
        }=this.state;

        
        

        return(
            <div>

                        

            <table className='table table-striped'>

                <thead>
                    <tr>
                        <th>
                            <div className='d-flex flex-row'>
                                <input className='form-control m-2' onChange={this.changeMovieIdFilter} 
                                    placeholder="Filter"></input>
                                <button type="button" className='btn mr-1' onClick={()=>this.sortResult('id',true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
                                    </svg>
                                </button>
                                <button type="button" className='btn mr-1' onClick={()=>this.sortResult('id',false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
                                    </svg>
                                </button>
                            </div>  
                            Movie Id
                        </th>
                        <th>
                            <div className='d-flex flex-row'>
                                <input className='form-control m-2' onChange={this.changeMovieNameFilter} 
                                    placeholder="Filter"></input>
                                    <button type="button" className='btn mr-1' onClick={()=>this.sortResult('movieTitle',true)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
                                        </svg>
                                    </button>
                                    <button type="button" className='btn mr-1' onClick={()=>this.sortResult('movieTitle',false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
                                        </svg>
                                    </button>
                            </div>
                            Movie Title
                        </th>
                        <th>
                            Release Date
                        </th>
                        <th>
                            IMDB Rank
                        </th>
                        <th>
                            Blockchain Rank
                        </th>
                        {loginBool==true? 
                            <th>
                                <div className='d-flex flex-row   '>
                                <button type="button" className='btn btn-primary m-2 float-end     ' 
                                    data-bs-toggle="modal" data-bs-target="#cuModal"
                                    onClick={()=>this.addClick()}>
                                        Add Movie
                                </button>
                                </div>
                            </th>
                        :null}
                    </tr>
                </thead>

                <tbody>
                    {movies.map(mov=>
                        <tr key={mov.id} className="flex-row">
                            <td className='col-2'>{mov.id}</td>
                            <td>{mov.movieTitle}</td>
                            <td>{mov.releaseDate}</td>
                            <td className='col-1'>{mov.imdbRank}</td>
                            <td className='col-1'>{bcMovieIdList.includes((mov.id).toString())? 
                                bcMovieRankList[bcMovieIdList.indexOf((mov.id).toString())]
                            :null}</td>
                            <td className='col-1'>
                                {/* Eğer Filmin MovieRank kontratı oluşturulmuşsa: */}
                                {bcMovieIdList.includes((mov.id).toString())? 
                                    <button type="button" className='btn  mr-1' 
                                    data-bs-toggle="modal" data-bs-target="#voteModal"
                                    onClick={()=>{
                                        this.editClick(mov);
                                        this.bcMovieVoteClick(mov.id);
                                        }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-123" viewBox="0 0 16 16">
                                        <path d="M2.873 11.297V4.142H1.699L0 5.379v1.137l1.64-1.18h.06v5.961h1.174Zm3.213-5.09v-.063c0-.618.44-1.169 1.196-1.169.676 0 1.174.44 1.174 1.106 0 .624-.42 1.101-.807 1.526L4.99 10.553v.744h4.78v-.99H6.643v-.069L8.41 8.252c.65-.724 1.237-1.332 1.237-2.27C9.646 4.849 8.723 4 7.308 4c-1.573 0-2.36 1.064-2.36 2.15v.057h1.138Zm6.559 1.883h.786c.823 0 1.374.481 1.379 1.179.01.707-.55 1.216-1.421 1.21-.77-.005-1.326-.419-1.379-.953h-1.095c.042 1.053.938 1.918 2.464 1.918 1.478 0 2.642-.839 2.62-2.144-.02-1.143-.922-1.651-1.551-1.714v-.063c.535-.09 1.347-.66 1.326-1.678-.026-1.053-.933-1.855-2.359-1.845-1.5.005-2.317.88-2.348 1.898h1.116c.032-.498.498-.944 1.206-.944.703 0 1.206.435 1.206 1.07.005.64-.504 1.106-1.2 1.106h-.75v.96Z"/>
                                    </svg>
                                </button>
                                :null}

                                {/* Eğer Filmin MovieRank kontratı oluşturulmamışsa ve admin girişi yapılmışsa kontrat oluşturmak için: */}
                                {!(bcMovieIdList.includes((mov.id).toString()))&&loginBool==true? 
                                    <button type="button" className='btn  mr-1'
                                        onClick={()=>this.bcCreateMRContract(mov)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-node-plus" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M11 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM6.025 7.5a5 5 0 1 1 0 1H4A1.5 1.5 0 0 1 2.5 10h-1A1.5 1.5 0 0 1 0 8.5v-1A1.5 1.5 0 0 1 1.5 6h1A1.5 1.5 0 0 1 4 7.5h2.025zM11 5a.5.5 0 0 1 .5.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2A.5.5 0 0 1 11 5zM1.5 7a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1z"/>
                                        </svg>
                                    </button>
                                :null}
                                
                            </td>
                            {loginBool==true?
                            <>
                            <td className='col-1'>
                                <button type="button" className='btn  mr-1' 
                                    data-bs-toggle="modal" data-bs-target="#cuModal"
                                    onClick={()=>this.editClick(mov)}>

                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                    </svg>
                                </button>
                            </td>
                            <td className='col-1'>
                                <button type="button" className='btn  mr-1'
                                    data-bs-toggle="modal" data-bs-target="#deleteModal"
                                    onClick={()=>this.editClick(mov)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                    </svg>
                                </button>
                            </td>
                            </>
                            :null}
                            {loginBool==false?
                                <td className='col-2'>
                                    <button type="button" className='btn btn-primary float-end'
                                        data-bs-toggle="modal" data-bs-target="#dirModal"
                                        onClick={()=>this.getDirector(mov.id)}>
                                        Görüntüle
                                    </button>
                                </td>
                            :null}

                        </tr>
                        )}
                </tbody>

            </table>

            <div className='modal fade' id="cuModal" tabIndex="-1" aria-hidden="true">
                <div className='modal-dialog modal-lg modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title'>{modalTitle}</h5>
                            <button type="button" className='btn-close' data-bs-dismiss="modal" aria-label="close"></button>
                        </div>
                        <div className='modal-body'>

                            {MovieId!=0?
                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>Movie Id</span>
                                    <input type="text" className='form-control' 
                                        value={MovieId} disabled></input>
                                </div>
                            :null}
                            

                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Movie Name</span>
                                <input type="text" className='form-control'
                                    value={MovieName}
                                    onChange={this.changeMovieName}></input>
                            </div>

                            <div className='input-group mb-4'>
                                <span className='input-group-text mb-1'>Release Date</span>
                                <input type="text" className='form-control'
                                    value={MovieReleaseDate}
                                    onChange={this.changeMovieReleaseDate}></input>
                            </div>

                            <div className='input-group mb-4'>
                                <span className='input-group-text mb-1'>IMDB Rank</span>
                                <input type="text" className='form-control'
                                    value={MovieIMDBRank}
                                    onChange={this.changeMovieImdbRank}></input>
                            </div>
                            <div className='input-group mb-4'>
                                <div className="dropdown col-4">
                                    {Object.keys(this.state.DropDirectorNameFilter).map(drop => 
                                        <>
                                        <button className="btn btn-secondary dropdown-toggle col-10" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                            {this.state.DropDirectorNameFilter[drop]}
                                        </button>
                                        <button type="button" className='btn col-2' onClick={()=>this.decreaseDropDirector(drop)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square-fill" viewBox="0 0 16 16">
                                                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>
                                            </svg>
                                        </button>
                                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                            {directorList.map(dir =>
                                                <li>
                                                    <a className="dropdown-item" href="#" onClick={(e) => {
                                                        var state = this.state.DropDirectorNameFilter;
                                                        state[drop] = dir.firstName + " " + dir.lastName;

                                                        var state_id = this.state.mdId;
                                                        state_id[drop] = dir.id;

                                                        this.setState({ mdId: state_id, DropDirectorNameFilter:state })}}>
                                                        {dir.id} {dir.firstName} {dir.lastName}
                                                    </a>
                                                </li>
                                            )}
                                        </ul>
                                        
                                        </>
                                    )}
                                    
                                </div>
                                <div className='col-2' >
                                    <button type="button" className='btn mr-1' onClick={()=>this.increaseDropDirector()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-plus-square-fill" viewBox="0 0 16 16">
                                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z"/>
                                    </svg>
                                    </button>
                                </div>
                                
                            </div>
                            
                            

                            

                            
                            
                            {MovieId==0?
                                

                                <button type='button' className='btn btn-primary float-start' onClick={()=>this.createClick()}>
                                    Creates</button>   
                            :null}

                            {MovieId!=0?
                                <button type='button' className='btn btn-primary float-start' onClick={()=>this.updateClick(MovieId)}>
                                    Update</button>    
                            :null}

                        </div>
                    </div>
                </div>
            </div>

            <div className='modal fade' id="dirModal" tabIndex="-1" aria-hidden="true">
                    <div className='modal-dialog modal-lg modal-dialog-centered'>
                        <div className='modal-content'>

                            <div className='modal-header'>
                                <h5 className="modal-title">{MovieName}</h5>
                                <button type='button' className='btn-close' data-bs-dismiss="modal" aria-label='close'></button>
                            </div>

                            <div className='modal-body'>


                                <table className='table table-striped'>
                                    <thead>
                                        <tr>
                                            <th> Director Id </th>
                                            <th> Director Name </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {(directorDirect).map(dir => 
                                            
                                            <tr key={dir.director.id}>
                                                <td> {dir.director.id} </td>
                                                <td> {dir.director.firstName} {dir.director.lastName}</td>
                                            </tr>
                                        )}
                                        
                                    </tbody>
                                </table>

                                
                            </div>

                        </div>
                    </div>
                </div>

            <div className='modal fade' id="deleteModal" tabIndex="-1" aria-hidden="true">
                <div className='modal-dialog modal-sm modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <div className="row justify-content-center">
                                <h5 className='modal-title'>
                                    Delete?
                                </h5>
                            </div>
                            <button type='button' className='btn-close' data-bs-dismiss="modal" aria-label="close"></button>
                        </div>
                        <div className='modal-body'>
                            <button type='button' className='btn btn-primary float-start' onClick={()=>this.deleteClick(MovieId)}>
                                    Delete</button>  
                        </div>
                    </div>
                </div>
            </div>

            <div className='modal fade' id="voteModal" tabIndex="-1" aria-hidden="true">
            <div className='modal-dialog modal-sm modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <div className="row justify-content-center">
                                <h5 className='modal-title'>
                                    Vote {MovieName} Rank: {bcRankNow}
                                </h5>
                            </div>
                            <button type='button' className='btn-close' data-bs-dismiss="modal" aria-label="close"></button>
                        </div>


                        <div className='modal-body'>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Rank: [1-10]</span>
                                <input type="text" className='form-control'
                                value={BCMovieRank}
                                onChange={this.changeBCMovieRank}></input>
                            </div>
                            {bcVoteBool==false?
                                <button type='button' className='btn btn-primary float-start' onClick={()=>this.bcMovieVote(MovieId)}>
                                    Vote 
                                </button>  
                            :null}  

                            {bcVoteBool==true? 
                                <button type='button' className='btn btn-danger float-start' disabled>
                                    You can not vote film which you have already voted
                                </button> 
                            :null}            
                            
                                            
                        </div>
                    </div>
                </div>
            </div>

            
    
                

            </div>

        );
    }
}