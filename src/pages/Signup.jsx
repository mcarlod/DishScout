import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/DishScoutLogo.png";
import { useAuth } from "../context/AuthContext";
import '../styles/globals.css'

function Signup() {
    const { signUp } = useAuth();
    const navigate = useNavigate();
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
        setSubmitting(false);
        if (error) {
            setError(error.message);
            return;
        }
        // With email confirmation enabled, Supabase returns no session until the link is clicked
        if (!data.session) {
            setMessage("Check your email to confirm your account, then sign in.");
            return;
        }
        navigate("/home");
    };

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

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="Jane Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Janedoe@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                            required
                        />
                    </div>
                    {error && <div className="auth-error">{error}</div>}
                    {message && <div className="auth-message">{message}</div>}
                    <button type="submit" className="sign-in-btn" disabled={submitting}>
                        {submitting ? "Creating account..." : "Create account"}
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
