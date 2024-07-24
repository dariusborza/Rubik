import React from 'react';
import './Navbar.css';

function Navbar() {

  return (
    <div className='navbar'>
    <nav>
        <label className = "logo">Rubik</label>
      <ul>
        <li><a href='/home'>home</a></li>
        <li><a href="/">Logout</a></li>
      </ul>
    </nav>
    </div>
  );
}

export default Navbar;