import React from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';



const App = () => {
  return (
    <>
    <Router>
      <Navbar/>
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Services' element={<Services />} />
          <Route path='/Contact' element={<Contact />} />

      </Routes>  
    </Router>

    
    </>
  );
};

export default App;