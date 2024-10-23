import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import "./Navbar.css"
import { Button } from './Button';

const Navbar = () => {
  const [click, setClick] = useState(false);
  const[button, setButton] = useState(true);

  const handleClick =() => setClick(!click);
  const closeMobileMenu =() => setClick(false);

  const showButton = ()=> {
    if(window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  },[]);

  window.addEventListener('resize', showButton);

  return (
    <>
        <nav className='navbar'>
            <div className='navbar-container'>
                <Link to="/" className='navbar-logo' onClick={closeMobileMenu}>
                    CITYEXPO <i className='fas fa-route' style={{ fontSize: '48px', color: 'red' }}/>
                </Link>
                
                <div className='menu-icon' onClick={handleClick}>
                  <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                </div>
                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                  <li className='nav-item'>
                    <Link to='/' className='nav-links' onClick={closeMobileMenu}>Home</Link>
                  </li>
                  <li>
                  <Link to="/Services"className='nav-links' onClick={closeMobileMenu}>Services</Link>
                  </li>
                  <li>
                  <Link to="/Contact"className='nav-links' onClick={closeMobileMenu}>Contact</Link>
                  </li>
                  <li>
                    <Link to="/"className='nav-links-mobile' onClick={closeMobileMenu}>Get Exploring</Link> 
                  </li>
                </ul>
                {button && <Button buttonStyle='btn--outline'>Get Exploring</Button>}
            </div>
        </nav>
    </>
    // <div className='navbar'>
    //     <h1>City Explorer</h1>
    //     <ul className='nav-menu'>
    //         <li>Home</li>
    //         <li>Services</li>
    //         <li>Contact</li>

    //     </ul>
    // </div>
  )
}

export default Navbar;