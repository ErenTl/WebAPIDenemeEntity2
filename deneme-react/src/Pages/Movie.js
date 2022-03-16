import React,{Component} from 'react';
import {variables} from '../Variables.js';

export class Movie extends Component{

    constructor(props) {
        super(props);

        this.state={
            movies:[],
            modalTitle:"",
            MovieName:"",
            MovieId:0,

            MovieIdFilter:"",
            MovieNameFilter:"",
            moviesWithoutFilter:[]
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
    }

    componentDidMount() {
        this.refreshList();
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

    addClick() {
        console.log("addclick");
        this.setState({
            modalTitle:"Add Movie",
            MovieName:"",
            MovieReleaseDate:"",
            MovieIMDBRank:"",
            MovieId:0
        });
    }

    editClick(mov) {
        console.log("editclick");
        this.setState({
            modalTitle:"Edit Movie",
            MovieName:mov.movieTitle,
            MovieId:mov.id,
            MovieReleaseDate:mov.releaseDate,
            MovieIMDBRank:mov.imdbRank
        });
    }

    createClick() {
        var options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                movieTitle:this.state.MovieName,
                releaseDate:this.state.MovieReleaseDate,
                imdbRank:this.state.MovieIMDBRank
            })
        }
        fetch(variables.API_URL+'movie/', options )
        .then(res=>res.json())
        .then((result)=>{
            alert(result);
            this.refreshList();
        }, (error)=>{
            alert(error);
        });
        console.log("hey "+this.state.MovieName,);
    }

    updateClick(id) {
        var options = {
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
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
            alert(result);
            this.refreshList();
        }, (error)=>{
            alert(error);
        });

    }

    deleteClick(id) {
        var options = {
            method: 'DELETE'
        }

        fetch(variables.API_URL+'movie/'+id, options)
        .then(res=>res.json())
        .then((result)=>{
            alert(result);
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
            MovieIMDBRank
        }=this.state;

        
        

        return(
            <div>

                <button type="button" className='btn btn-primary m-2 float-end' 
                    data-bs-toggle="modal" data-bs-target="#cuModal"
                    onClick={()=>this.addClick()}>
                        Add Movie
                </button>
            
            <table className='table table-striped'>

                <thead>
                    <tr>
                        <th>
                            <input className='form-control m-2' onChange={this.changeMovieIdFilter} 
                                placeholder="Filter"></input>
                            Movie Id
                        </th>
                        <th>
                            <input className='form-control m-2' onChange={this.changeMovieNameFilter} 
                                placeholder="Filter"></input>
                            Movie Title
                        </th>
                        <th>
                            Release Date
                        </th>
                        <th>
                            IMDB Rank
                            {variables.API_URL+'movie/'+MovieId }
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {movies.map(mov=>
                        <tr key={mov.id}>
                        <td>{mov.id}</td>
                        <td>{mov.movieTitle}</td>
                        <td>{mov.releaseDate}</td>
                        <td>{mov.imdbRank}</td>
                        <td>
                            <button type="button" className='btn  mr-1' 
                                data-bs-toggle="modal" data-bs-target="#cuModal"
                                onClick={()=>this.editClick(mov)}>

                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                </svg>
                            </button>
                        </td>
                        <td>
                            <button type="button" className='btn  mr-1'
                                data-bs-toggle="modal" data-bs-target="#deleteModal"
                                onClick={()=>this.editClick(mov)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                </svg>
                            </button>
                        </td>
                        

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

            <div className='modal fade' id="deleteModal" tabIndex="-1" aria-hidden="true">
                <div className='modal-dialog modal-sm modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <div class="row justify-content-center">
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

            
                <h3>This is Movie page.</h3>

                

            </div>

        );
    }
}