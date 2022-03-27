import React,{Component} from 'react';
import {variables} from '../Variables.js';

export class Director extends Component{

    constructor(props) {
        super(props);

        this.state={
            directors:[],
            dirMov:[],
            directorName:""
        }
    }

    componentDidMount() {
        this.refreshList();
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
                            <th> Director Id </th>
                            <th> Director Name </th>
                        </tr>
                    </thead>

                    <tbody>
                        {directors.map(dir => 
                            
                            <tr key={dir.id}>
                                <td> {dir.id} </td>
                                <td> {dir.firstName} {dir.lastName}</td>
                                <td>
                                    <button type="button" className='btn btn-secondary float-end'
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
                
            </div>
        );
    }
}