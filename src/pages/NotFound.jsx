import { Link } from "react-router-dom";
import '../styles/globals.css'

// Shown for any URL that doesn't match a page
function NotFound() {
    return (
        <div className="recipes-status">
            <div className="empty-state">
                <h1>Page not found</h1>
                <p>The page you're looking for doesn't exist or may have moved.</p>
                <Link to="/home" className="recipes-button">Back to recipes</Link>
            </div>
        </div>
    );
}

export default NotFound;
