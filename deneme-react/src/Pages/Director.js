import React,{Component} from 'react';
import {variables} from '../Variables.js';
import {createHash} from 'crypto';
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

    changeDirectorDateofBirth = (e) => {
        this.setState({directorNow: {...this.state.directorNow, dateofBirth:e.target.value}});
    }

    hash(string) {
        return createHash('sha256').update(string).digest('hex');
    }



    refreshList () {
        console.log("refresh");
        fetch(variables.API_URL+'directors', {
            headers:{
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            this.setState({directors:data});
        });
        console.log(this.hash('foo'));
    }

    editClick (dir) {
        this.setState( {
            modalTitle:"Edit Director",
            directorNow:dir
        });
    }

    deleteClick (dir) {
        this.setState( {
            modalTitle:"Delete Director",
            directorNow:dir
        });
    }

    addClick() {
        this.setState( {
            modalTitle:"Add Director",
            directorNow: {...this.state.directorNow, firstName:"", lastName:"", dateOfBirth:null, dateOfDeath:null, id:null, movieDirectors:[], sex:null, spouse:null }
            
        });
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

    editDirector(id) {
        var options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.directorNow)
        }
        fetch(variables.API_URL+'directors/'+id, options)
        .then(res=>res.json())
        .then((result)=>{
            alert("result: " + result);
            this.refreshList();
        }, (error)=>{
            this.refreshList();
        });
    }

    addDirector() {
        console.log("added");
        var options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.directorNow)
        }
        fetch(variables.API_URL+'directors/', options)
        .then(res=>res.json())
        .then((result)=>{
            alert("result: " + result);
            this.refreshList();
        }, (error)=>{
            this.refreshList();
        });
    }

    deleteDirector(id) {
        var options = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        fetch(variables.API_URL+'directors/'+id, options)
        .then(res=>res.json())
        .then((result)=>{
            this.refreshList();
        }, (error)=>{
            console.log("error: " + error);
            this.refreshList();
        });

    }



    render() {
        const {
            directors,
            dirMov,
            directorName,
            directorNow,
            modalTitle
        }=this.state;

        return(
            <div>
                
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th> Directosr Id </th>
                            <th> Director Name </th>
                            <th>
                                <div className='d-flex flex-row   '>
                                    <button type="button" className='btn btn-primary m-2 float-end     ' 
                                        data-bs-toggle="modal" data-bs-target="#cuModal"
                                        onClick={()=>this.addClick()}>
                                            Add Director
                                    </button>
                                </div>
                            </th>
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
                                <td className='col-1'>
                                    <button type="button" className='btn  mr-1'
                                        data-bs-toggle="modal" data-bs-target="#cuModal" onClick={() => this.deleteClick(dir)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                            </svg>
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
                                <h5 className='modal-title'>{modalTitle}</h5>
                                <button type="button" className='btn-close' data-bs-dismiss="modal" aria-label="close"></button>
                            </div>
                            <div className='modal-body'>

                                {modalTitle=="Edit Director"?
                                    <div className='input-group mb-3'>
                                        <span className='input-group-text'>Director Id</span>
                                        <input type="text" className='form-control' 
                                            value={this.state.directorNow.id} disabled></input>
                                    </div>
                                :null}
                                

                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>Director First Name</span>
                                    <input type="text" className='form-control'
                                        value={directorNow.firstName}
                                        onChange={this.changeDirectorFirstName}></input>
                                </div>
                                
                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>Director Last Name</span>
                                    <input type="text" className='form-control'
                                        value={directorNow.lastName}
                                        onChange={this.changeDirectorLastName}></input>
                                </div>

                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>Director Date of Birth</span>
                                    <input type="text" className='form-control'
                                        value={directorNow.dateOfBirth}
                                        onChange={this.changeDirectorDateofBirth}></input>
                                </div>

                                {/*Gender Edit Section*/}
                                <div className='input-group mb-3'>
                                    <div className="dropdown col-4">
                                        <button className="btn btn-secondary dropdown-toggle col-10" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                            {directorNow.sex==0? <>Kadın</> :null}
                                            {directorNow.sex==1? <>Erkek</> :null}
                                            {directorNow.sex!=1&&directorNow.sex!=0? <>Select Gender</> :null}
                                        </button>
                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                <li>
                                                    <a className="dropdown-item" onClick={()=> {this.setState({directorNow:{...this.state.directorNow, sex:1}})}}>
                                                        Erkek
                                                    </a>
                                                </li>
                                                <li>
                                                    <a className="dropdown-item" onClick={()=> {this.setState({directorNow:{...this.state.directorNow, sex:0}})}}>
                                                        Kadın
                                                    </a>
                                                </li>
                                            </ul>
                                    </div>
                                </div>
                                
                                {modalTitle=="Edit Director"?
                                    <button type='button' className='btn btn-primary float-start' onClick={()=>this.editDirector(directorNow.id)}>
                                    Update</button>
                                :null}

                                {modalTitle=="Add Director"?
                                    <button type='button' className='btn btn-primary float-start' onClick={()=>this.addDirector()}>
                                    Add</button>
                                :null}

                                {modalTitle=="Delete Director"?
                                    <button type='button' className='btn btn-danger float-start' onClick={()=>this.deleteDirector(directorNow.id)}>
                                    Delete</button>
                                :null}
                                
                                

                            </div>
                        </div>
                    </div>
                </div>

                
                
            </div>
        );
    }
}