import logo from "../assets/DishScoutLogo.png";
import '../styles/globals.css'

function Login() {
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
                <h1>Welcome back</h1>
                <p>Sign in to access your saved recipes and profile</p>

                <form>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="Janedoe@example.com" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="********" />
                    </div>
                    <button type="submit" className="sign-in-btn">Sign in</button>
                </form>

                <div className="signup-link">
                    Don't have an account? <a href="/signup">Sign up</a>
                </div>
            </div>
        </div>
    );
}

export default Login;
