import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/DishScoutLogo.png";
import { useAuth } from "../context/AuthContext";
import '../styles/globals.css'

function Login() {
    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        const { error } = await signIn(email, password);
        if (error) {
            setSubmitting(false);
            setError(error.message);
        }
        // On success the button keeps saying "Signing in…" while the profile loads;
        // PublicOnlyRoute then moves on to Home with the name already in place
    };

    return (
        <div className="login-container">
            <div className="login-banner">
                <div className="logo-container">
                    <img src={logo} alt="DishScout Logo" className="logo"/>
                    <h2>DishScout</h2>
                </div>
                <div className="banner-content">
                    <p className="banner-title">Explore flavors from across the world.</p>
                    <p>Discover, save, and cook recipes all in one place</p>
                </div>
            </div>
            <div className="login-form-container">
                <h1>Welcome back</h1>
                <p>Sign in to access your saved recipes and profile</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            type="email"
                            autoComplete="email"
                            placeholder="Janedoe@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="auth-error" role="alert">{error}</div>}
                    <button type="submit" className="sign-in-btn" disabled={submitting}>
                        {submitting ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <div className="signup-link">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
