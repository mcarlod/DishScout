import { useNavigate, NavLink } from 'react-router-dom';
import logo from '../assets/DishScoutLogo.png'
import '../styles/components.css'
import logout from '../assets/Log out.png'

function Navbar() {
    const navigate = useNavigate();
    return (
        <nav className = "navbar">
            <div className="logo-container">
                <img src={logo} alt="DishScout Logo" className="logo"/>
                <h2>DishScout</h2>
            </div>

            <div className="nav-pages">
                <NavLink to="/home" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Recipes</NavLink>
                <NavLink to="/saved" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Saved</NavLink>
                <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Profile</NavLink>
                <button className="logout-btn" onClick={() => navigate("/")}>
                    <img src={logout} alt="Log out" className="logout-icon"/>
                </button>
            </div>

        </nav>
    )
}

export default Navbar;