import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import logo from '../assets/DishScoutLogo.png'
import '../styles/components.css'
import logout from '../assets/Log out.png'
import { useAuth } from '../context/AuthContext'

const linkClass = ({ isActive }) => isActive ? "nav-link active" : "nav-link";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { signOut } = useAuth();
    const navRef = useRef(null);
    const toggleRef = useRef(null);

    // The menu remembers which page it was opened on, so it closes by itself after navigating
    const [openOn, setOpenOn] = useState(null);
    const menuOpen = openOn === location.pathname;
    const closeMenu = () => setOpenOn(null);

    // While the mobile menu is open, close it on a click outside the navbar or on Escape
    useEffect(() => {
        if (!menuOpen) return;

        function handlePointerDown(e) {
            if (!navRef.current?.contains(e.target)) setOpenOn(null);
        }
        function handleKeyDown(e) {
            if (e.key === "Escape") {
                setOpenOn(null);
                toggleRef.current?.focus();
            }
        }

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [menuOpen]);

    const handleLogout = async () => {
        closeMenu();
        await signOut();
        navigate("/");
    };

    return (
        <nav className="navbar" ref={navRef} aria-label="Main">
            <div className="logo-container">
                <img src={logo} alt="DishScout Logo" className="logo"/>
                <h2>DishScout</h2>
            </div>

            {/* Only shown on small screens */}
            <button
                ref={toggleRef}
                type="button"
                className="menu-toggle"
                aria-expanded={menuOpen}
                aria-controls="nav-menu"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={() => setOpenOn(menuOpen ? null : location.pathname)}
            >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="menu-toggle-icon">
                    {menuOpen
                        ? <path d="M6 6l12 12M18 6L6 18" />
                        : <path d="M4 7h16M4 12h16M4 17h16" />}
                </svg>
            </button>

            {/* A row of links on desktop; a dropdown under the menu button on small screens */}
            <div id="nav-menu" className={menuOpen ? "nav-pages open" : "nav-pages"}>
                <NavLink to="/home" className={linkClass} onClick={closeMenu}>Recipes</NavLink>
                <NavLink to="/saved" className={linkClass} onClick={closeMenu}>Saved</NavLink>
                <NavLink to="/profile" className={linkClass} onClick={closeMenu}>Profile</NavLink>
                <button type="button" className="logout-btn" onClick={handleLogout} aria-label="Log out">
                    <img src={logout} alt="" className="logout-icon"/>
                    <span className="logout-label">Log out</span>
                </button>
            </div>

        </nav>
    )
}

export default Navbar;
