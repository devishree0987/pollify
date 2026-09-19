import { useState } from "react";
import "./App.css";
import Register from "./Register";
import Dashboard from "./Dashboard";
import CreatePoll from "./CreatePoll";
import VotePoll from "./VotePoll";
import LiveResults from "./page/LiveResults";
import ForgotPassword from "./ForgotPassword";
function App() {

  const savedUser = localStorage.getItem("pollifyUser");

  const [user, setUser] = useState(
    savedUser ? JSON.parse(savedUser) : null
  );

  const [page, setPage] = useState(
    savedUser ? "dashboard" : "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pollId, setPollId] = useState(
  new URLSearchParams(window.location.search).get("poll")
  );
  const [resultPollId, setResultPollId] = useState(null);
  const [pollTemplate, setPollTemplate] = useState(null);
  const [createTemplate, setCreateTemplate] = useState(null);

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:8080/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {

  setUser(data.user);

  localStorage.setItem(
    "pollifyUser",
    JSON.stringify(data.user)
  );

  setPage("dashboard");
}
     else {
      alert(data);
    }

  } catch (error) {
    console.error(error);
    alert("Cannot connect to Go backend");
  }
};
//vote poll page 
if (pollId) {
  return (
    <VotePoll
      pollId={pollId}
      onBack={() => {
        window.history.pushState({}, "", "/");
        setPollId(null);
        setPage("login");
      }}
    />
  );
}
// Live Results page

if (page === "results") {
  return (
    <LiveResults
      pollId={resultPollId}
      onBack={() => setPage("dashboard")}
    />
  );
}

//create poll page ku

if (page === "createPoll") {
  return (
    <CreatePoll
      template={createTemplate}
      onBack={() => {
        setCreateTemplate(null);
        setPage("dashboard");
      }}
    />
  );
}
// dash borad page show panna

 if (page === "dashboard") {
  return (
    <Dashboard
      user={user}

      onCreatePoll={(template = null) => {
      setCreateTemplate(template);
      setPage("createPoll");
  }}

      onViewResults={(id) => {
        setResultPollId(id);
        setPage("results");
      }}

      onLogout={() => {
        setUser(null);
        localStorage.removeItem("pollifyUser");
        setPage("login");
      }}
    />
  );
}
if (page === "forgotPassword") {
  return (
    <ForgotPassword
      goToLogin={() => setPage("login")}
    />
  );
}

   // Register page show panna
  if (page === "register") {
    return (
      <Register
        goToLogin={() => setPage("login")}
      />
    );
  }

//login page
  return (
    <div className="login-page">

      {/* Left Side */}
      <div className="login-left">
        <div className="brand">
          <div className="brand-icon">📊</div>
          <span>Pollify</span>
        </div>

        <div className="hero-content">
          <h1>
            Make every <span>voice</span> count.
          </h1>

          <p>
            Create live polls, collect instant responses,
            and see results in real-time.
          </p>

          <div className="poll-preview">
            <div className="preview-header">
              <span>Live Poll</span>
              <span className="live-dot">● LIVE</span>
            </div>

            <h3>Which technology do you prefer?</h3>

            <div className="option">
              <span>React</span>
              <span>45%</span>
            </div>

            <div className="progress">
              <div className="progress-fill react"></div>
            </div>

            <div className="option">
              <span>Node.js</span>
              <span>30%</span>
            </div>

            <div className="progress">
              <div className="progress-fill node"></div>
            </div>

            <div className="option">
              <span>Python</span>
              <span>25%</span>
            </div>

            <div className="progress">
              <div className="progress-fill python"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="login-right">

        <div className="login-box">

          <div className="mobile-logo">
            📊 <span>Pollify</span>
          </div>

          <h2>Welcome back 👋</h2>

          <p className="subtitle">
            Sign in to continue to your dashboard
          </p>

          <form onSubmit={handleLogin}>

            <label>Email Address</label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="password-label">
              <label>Password</label>
              <button
               type="button"
               className="forgot-password-btn"
              onClick={() => setPage("forgotPassword")}
               >
               Forgot password?
              </button>
            </div>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="remember">
              <label>
                <input type="checkbox" />
                Remember me
              </label>
            </div>

            <button type="submit">
              Sign In
              <span>→</span>
            </button>

          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button className="google-btn" type="button">
            <span className="google-icon">G</span>
            Continue with Google
          </button>

         <p className="signup">
          Don't have an account?

          <button
            type="button"
            onClick={() => setPage("register")}
          >
            Create an account
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

export default App;