import React,{Component} from 'react';
import {createHash} from 'crypto';
import { variables } from '../Variables';

export class Home extends Component{

    constructor(props) {
        super(props);

        this.state={
            userId:0,
            userName:"",
            psw:"",
            loginUserName:"",
            loginPsw:"",
            permission:0,
            accessToken:"",
            userWithToken:[],
            loginBool:false
            
        }
        
    }

    componentDidMount() {
        this.setLoginBool();
    }

    setLoginBool() {
        if(localStorage.getItem('user')!=null)  {
            this.setState({loginBool:true});
        }else {
            this.setState({loginBool:false});
        }
    }

    hash(string) {
        return createHash('sha256').update(string).digest('hex');
    }

    changeUserName = (e) => {
        this.setState({userName:e.target.value});
    }

    changePsw = (e) => {
        this.setState({psw:e.target.value});
    }

    changeLoginUserName = (e) => {
        this.setState({loginUserName:e.target.value});
    }

    changeLoginPsw = (e) => {
        this.setState({loginPsw:e.target.value});
    }

    login() {
        var options = {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                userName:this.state.userName,
                pswSha:this.hash(this.state.psw)
            })
        };
        fetch(variables.API_URL+"users/login", options)
        .then(res => res.json())
        .then((res) => {
            this.setState({userWithToken:res}); 
            localStorage.setItem('user',JSON.stringify({...res, pswSha:""}));
            this.setState({loginBool:true});
        },(error) => {
            alert("hata");
        }
          );
          console.log(localStorage.getItem('JWT'));
    }

    signUp() {
        var options = {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                userName:this.state.loginUserName,
                pswSha:this.hash(this.state.loginPsw),
                permission:1
            })
        };
        fetch(variables.API_URL+"users", options)
        .then(res => res.json())
        .then((res) => {
            alert("Başarıyla oluşturuldu");
        },(error) => {
            alert("hata");
        });
    }

    logOut() {
        localStorage.removeItem('user');
        this.setState({loginBool:false});
    }


    render() {
        const {
            userName,
            psw,
            loginUserName,
            loginPsw,
            loginBool,
            userWithToken
        }=this.state;
        return(
            <div>
                <h3>This is home page.</h3>
                <div className='container'>
                    {loginBool==false?  
                    <div className='row justify-content-md-center'>
                        <div className='col-3 border rounded'>
                            <h5>Log In</h5>
                            <div className='input-group mb-3 col-3'>
                                <span className='input-group-text'>Username</span>
                                <input type="text" className="form-control" placeholder="Username"
                                value={userName}
                                onChange={this.changeUserName}></input>
                            </div>

                            <div className='input-group mb-3 col-3'>
                                <span className='input-group-text'>Password</span>
                                <input type="password" className="form-control" placeholder="******"
                                value={psw}
                                onChange={this.changePsw}></input>
                            </div>
                            <button type='button' className='btn btn-primary float-start col-12' onClick={()=>this.login()}>
                                    Login
                            </button>   
                            
                        </div>

                        <div className='offset-md-2 col-3 border rounded'>
                            <h5>Sign Up</h5>
                            <div className='input-group mb-3 col-3'>
                                <span className='input-group-text'>Username</span>
                                <input type="text" className="form-control" placeholder="Username"
                                value={loginUserName}
                                onChange={this.changeLoginUserName}></input>
                            </div>

                            <div className='input-group mb-3 col-3'>
                                <span className='input-group-text'>Password</span>
                                <input type="password" className="form-control" placeholder="******"
                                value={loginPsw}
                                onChange={this.changeLoginPsw}></input>
                            </div>
                            <button type='button' className='btn btn-primary float-start col-12' onClick={()=>this.signUp()}>
                                    Sign Up
                            </button>
                        </div>
                    </div>
                    :null}

                    {loginBool==true?
                        <>
                        <h5>User Id: {JSON.parse(localStorage.getItem('user')).id}</h5>
                        <h5>User Name: {JSON.parse(localStorage.getItem('user')).userName}</h5>
                        <h5>User Permission: {JSON.parse(localStorage.getItem('user')).permission}</h5>
                        <h5>User Access Token: {JSON.parse(localStorage.getItem('user')).accessToken}</h5>
                        <button type='button' className='btn btn-primary float-start col-12' onClick={()=>this.logOut()}>
                        Log Out
                        </button>
                        </>
                    :null}

                </div>
            </div>
        );
    }
}

