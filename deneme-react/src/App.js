import './App.css';
import {Home} from "./Pages/Home";
import {Movie} from './Pages/Movie';
import {Director} from './Pages/Director';
import {BrowserRouter, Route, Routes, NavLink} from 'react-router-dom';

function App() {
  return (
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
            <NavLink className='btn btn-light btn-outline-primary' to='/movie'>
              Movie
            </NavLink>
          </li>
        </ul>

        <ul className='navbar-nav'>
          <li className='nav-item- m-1'>
            <NavLink className='btn btn-light btn-outline-primary' to='/director'>
              Director
            </NavLink>
          </li>
        </ul>
        

      </nav>

      <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/movie" element={<Movie />} />
          <Route path="/director" element={<Director />} />
      </Routes>
      
    </div>
    </BrowserRouter>
  );
}

export default App;
