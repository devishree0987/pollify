import { useState } from "react";
import "./App.css";

function Register({ goToLogin }) {

  // User type panna values-ah store panna
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Create Account button click pannumbothu
  const handleRegister = async (e) => {
  e.preventDefault();

  if (!name || !email || !password || !confirmPassword) {
    alert("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:8080/api/register",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      }
    );

    const data = await response.text();

    if (response.ok) {
      alert("Account created successfully!");
      goToLogin();
    } else {
      alert(data);
    }

  } catch (error) {
    console.error(error);
    alert("Cannot connect to Go backend");
  }
};

  return (
    <div className="register-page">

      {/* Left Side */}
      <div className="register-left">

        <div className="brand">
          <div className="brand-icon">📊</div>
          <span>Pollify</span>
        </div>

        <div className="register-hero">

          <h1>
            Start your <span>polling</span> journey.
          </h1>

          <p>
            Create engaging polls, collect responses,
            and make every voice count.
          </p>

          <div className="features">

            <div className="feature">
              <span>✓</span>
              <p>Create live polls instantly</p>
            </div>

            <div className="feature">
              <span>✓</span>
              <p>Get real-time responses</p>
            </div>

            <div className="feature">
              <span>✓</span>
              <p>View results easily</p>
            </div>

          </div>

        </div>

      </div>


      {/* Right Side */}
      <div className="register-right">

        <div className="register-box">

          {/* Mobile Logo */}
          <div className="mobile-logo">
            📊 <span>Pollify</span>
          </div>

          <h2>Create your account</h2>

          <p className="register-subtitle">
            Join Pollify and start creating live polls
          </p>


          {/* Register Form */}
          <form onSubmit={handleRegister}>

            {/* Full Name */}
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />


            {/* Email */}
            <label>Email Address</label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />


            {/* Password */}
            <label>Password</label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />


            {/* Confirm Password */}
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />


            {/* Terms */}
            <div className="terms">

              <label>
                <input type="checkbox" required />
                I agree to the Terms & Conditions
              </label>

            </div>


            {/* Create Account Button */}
            <button type="submit" className="register-btn">
              Create Account
              <span>→</span>
            </button>

          </form>


          {/* Login Link */}
          <p className="login-link">

            Already have an account?

            <button
              type="button"
              onClick={goToLogin}
            >
              Sign in
            </button>

          </p>

        </div>


        {/* Footer */}
        <p className="footer-text">
          © 2026 Pollify. All rights reserved.
        </p>

      </div>

    </div>
  );
}

export default Register;
