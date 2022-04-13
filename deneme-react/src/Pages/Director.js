import React,{Component} from 'react';
import {variables} from '../Variables.js';

export class Director extends Component{

    constructor(props) {
        super(props);

        this.state={
            directors:[],
            dirMov:[],
            directorName:"",

            directorNow:[]
        }
    }

    componentDidMount() {
        this.refreshList();
    }

    changeDirectorFirstName = (e) => {
        this.setState({directorNow: {...this.state.directorNow, firstName:e.target.value}});
    }

    changeDirectorLastName = (e) => {
        this.setState({directorNow: {...this.state.directorNow, lastName:e.target.value}});
    }


    refreshList () {
        fetch(variables.API_URL+'directors', {
            headers:{
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            this.setState({directors:data});
        });
    }

    editClick (dir) {
        this.setState( {
            directorNow:dir
        })
    }

    updateMovClick(id) {
        fetch(variables.API_URL+'directors/'+id ,{
            headers:{
                'Accept':'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            this.setState({dirMov:data.movieDirectors, directorName:(data.firstName+" "+data.lastName)});
        });
    }

    editDirName(id) {
        fetch(variables.API_URL+'directors/name/'+id, {
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                firstName:this.state.directorNow.firstName,
                lastName:this.state.directorNow.lastName
            })
        })
        .then(res => res.json())
        .then(data => {
            this.refreshList();
            alert("Başarılı!");
        });
    }


    


    render() {
        const {
            directors,
            dirMov,
            directorName
        }=this.state;

        return(
            <div>
                
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th> Directosr Id </th>
                            <th> Director Name </th>
                        </tr>
                    </thead>

                    <tbody>
                        {directors.map(dir => 
                            
                            <tr key={dir.id}>
                                <td cl> {dir.id} </td>
                                <td> {dir.firstName} {dir.lastName}</td>
                                <td className='col-1'>
                                    <button type="button" className='btn  mr-1' 
                                        data-bs-toggle="modal" data-bs-target="#cuModal"
                                        onClick={()=>this.editClick(dir)}>

                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                        </svg>
                                    </button>
                                </td>
                                <td className='col-2'>
                                    <button type="button" className='btn btn-primary float-end'
                                        data-bs-toggle="modal" data-bs-target="#movModal"
                                        onClick={()=>this.updateMovClick(dir.id)}
                                    >
                                        Görüntüle
                                    </button>
                                </td>
                            </tr>

                        )}
                    </tbody>
                </table>


                
                
                {/* Showing director's movies modal */}
                <div className='modal fade' id="movModal" tabIndex="-1" aria-hidden="true">
                    <div className='modal-dialog modal-lg modal-dialog-centered'>
                        <div className='modal-content'>

                            <div className='modal-header'>
                                <h5 className="modal-title">{directorName}</h5>
                                <button type='button' className='btn-close' data-bs-dismiss="modal" aria-label='close'></button>
                            </div>

                            <div className='modal-body'>


                                <table className='table table-striped'>
                                    <thead>
                                        <tr>
                                            <th> Movie Id </th>
                                            <th> Movie Name </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {dirMov.map(dir => 
                                            
                                            <tr key={dir.movie.id}>
                                                <td> {dir.movie.id} </td>
                                                <td> {dir.movie.movieTitle}</td>
                                            </tr>
                                        )}
                                        
                                    </tbody>
                                </table>

                                
                            </div>

                        </div>
                    </div>
                </div>



                <div className='modal fade' id="cuModal" tabIndex="-1" aria-hidden="true">
                    <div className='modal-dialog modal-lg modal-dialog-centered'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>{"modalTitle"}</h5>
                                <button type="button" className='btn-close' data-bs-dismiss="modal" aria-label="close"></button>
                            </div>
                            <div className='modal-body'>

                                
                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>Director Id</span>
                                    <input type="text" className='form-control' 
                                        value={this.state.directorNow.id} disabled></input>
                                </div>
                                
                                

                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>Director First Name</span>
                                    <input type="text" className='form-control'
                                        value={this.state.directorNow.firstName}
                                        onChange={this.changeDirectorFirstName}></input>
                                </div>
                                
                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>Director Last Name</span>
                                    <input type="text" className='form-control'
                                        value={this.state.directorNow.lastName}
                                        onChange={this.changeDirectorLastName}></input>
                                </div>
                                
                                <button type='button' className='btn btn-primary float-start' onClick={()=>this.editDirName(this.state.directorNow.id)}>
                                    Update</button>
                                

                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        );
    }
}