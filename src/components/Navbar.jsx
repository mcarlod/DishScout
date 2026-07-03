import React from 'react';
import logo from '../assets/DishScoutLogo.png'

function Navbar() {
    return (
        <nav>
            <div>
                <img src={logo} alt="DishScout Logo" />
                <h2>DishScout</h2>
            </div>

            <div>
                <button onClick={() => navigate("/home")}>Recipes</button>
                <button onClick={() => navigate("/saved")}>Saved</button>
                <button onClick={() => navigate("/profile")}>Profile</button>
                <button onClick={() => navigate("/login")}>Logout</button>
            </div>

        </nav>
    )
}

export default Navbar;