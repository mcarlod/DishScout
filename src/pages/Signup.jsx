import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/DishScoutLogo.png";
import { useAuth } from "../context/AuthContext";
import '../styles/globals.css'

function Signup() {
    const { signUp } = useAuth();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setSubmitting(true);
        const { data, error } = await signUp(email, password, fullName);
        if (error) {
            setSubmitting(false);
            setError(error.message);
            return;
        }
        // With email confirmation enabled, Supabase returns no session until the link is clicked
        if (!data.session) {
            setSubmitting(false);
            setMessage("Check your email to confirm your account, then sign in.");
        }
        // With a session, the button keeps saying "Creating account…" while the profile loads;
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
                <h1>Create your account</h1>
                <p>Join to explore thousands of recipes</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="signup-name">Full Name</label>
                        <input
                            id="signup-name"
                            type="text"
                            autoComplete="name"
                            placeholder="Jane Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="signup-email">Email</label>
                        <input
                            id="signup-email"
                            type="email"
                            autoComplete="email"
                            placeholder="Janedoe@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="signup-password">Password</label>
                        <input
                            id="signup-password"
                            type="password"
                            autoComplete="new-password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                            required
                        />
                    </div>
                    {error && <div className="auth-error" role="alert">{error}</div>}
                    {message && <div className="auth-message" role="status">{message}</div>}
                    <button type="submit" className="sign-in-btn" disabled={submitting}>
                        {submitting ? "Creating account…" : "Create account"}
                    </button>
                </form>

                <div className="signup-link">
                    Already have an account? <Link to="/">Sign in</Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;
