import logo from "../assets/DishScoutLogo.png";
import '../styles/globals.css'

function Signup() {
    return (
        <div className="login-container">
            <div className="login-banner">
                <div className="logo-container">
                    <img src={logo} alt="DishScout Logo" className="logo"/>
                    <h2>DishScout</h2>
                </div>
                <div className="banner-content">
                    <h1>Explore flavors from across the world.</h1>
                    <p>Discover, save, and cook recipes all in one place</p>
                </div>
            </div>
            <div className="login-form-container">
                <h1>Create your account</h1>
                <p>Join to explore thousands of recipes</p>

                <form>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="Jane Doe" />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="Janedoe@example.com" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="********" />
                    </div>
                    <button type="submit" className="sign-in-btn">Create account</button>
                </form>

                <div className="signup-link">
                    Already have an account? <a href="/">Sign in</a>
                </div>
            </div>
        </div>
    );
}

export default Signup;
