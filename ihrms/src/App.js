import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './Pages/Login';
import Home from './Home';
import LeaveAsha from './Pages/LeaveAsha';
import LeaveRahul from './Pages/LeaveRahul';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path='/asha' element={<LeaveAsha/>}/>
        <Route path='/rahul' element={<LeaveRahul/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
