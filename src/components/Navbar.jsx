import React from 'react';
import logo from '../assets/DishScoutLogo.png'
import '../styles/components.css'

function Navbar() {
    return (
        <nav className = "navbar">
            <div className="logo-container">
                <img src={logo} alt="DishScout Logo" className="logo"/>
                <h2>DishScout</h2>
            </div>

            <div className="nav-pages">
                <button onClick={() => navigate("/home")}>Recipes</button>
                <button onClick={() => navigate("/saved")}>Saved</button>
                <button onClick={() => navigate("/profile")}>Profile</button>
                <button onClick={() => navigate("/login")}>Logout</button>
            </div>

        </nav>
    )
}

export default Navbar;