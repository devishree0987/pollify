import { useState } from "react";
import "./App.css";

function ForgotPassword({ goToLogin }) {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    setMessage(
      "If an account exists with this email, a password reset link will be sent."
    );
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}

      <div className="login-left">

        <div className="brand">

          <div className="brand-icon">
            📊
          </div>

          <span>
            Pollify
          </span>

        </div>

        <div className="hero-content">

          <h1>
            Reset your <span>password.</span>
          </h1>

          <p>
            Enter your registered email address and
            we'll help you get back into your account.
          </p>

          <div className="poll-preview">

            <div className="preview-header">

              <span>
                Pollify
              </span>

              <span className="live-dot">
                ● SECURE
              </span>

            </div>

            <h3>
              Your polls are waiting for you.
            </h3>

            <div className="option">
              <span>
                🔐 Secure Account
              </span>
            </div>

            <div className="option">
              <span>
                📊 Live Poll Results
              </span>
            </div>

            <div className="option">
              <span>
                🗳️ Make Every Voice Count
              </span>
            </div>

          </div>

        </div>

      </div>


      {/* RIGHT SIDE */}

      <div className="login-right">

        <div className="login-box">

          <div className="mobile-logo">
            📊 <span>Pollify</span>
          </div>

          <h2>
            Forgot Password?
          </h2>

          <p className="subtitle">
            Enter your email to reset your password.
          </p>


          <form onSubmit={handleSubmit}>

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />


            <button type="submit">
              Send Reset Link
              <span>→</span>
            </button>

          </form>


          {message && (
            <p className="forgot-message">
              {message}
            </p>
          )}


          <p className="signup">

            Remember your password?

            <button
              type="button"
              onClick={goToLogin}
            >
              Back to Login
            </button>

          </p>

        </div>


        <p className="footer-text">
          © 2026 Pollify. All rights reserved.
        </p>

      </div>

    </div>
  );
}

export default ForgotPassword;