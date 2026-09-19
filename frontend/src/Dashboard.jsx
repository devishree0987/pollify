import { useEffect, useState } from "react";
import "./App.css";

function Dashboard({
  user,
  onCreatePoll,
  onViewResults,
  onLogout
}) {

  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // GET ALL POLLS
  // =========================
  const fetchPolls = async () => {

    try {

      const response = await fetch(
        "http://localhost:8080/api/polls"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch polls");
      }

      const data = await response.json();

      setPolls(data);

    } catch (error) {

      console.error("Poll fetch error:", error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  // =========================
  // TOTAL RESPONSES
  // =========================
  const totalResponses = polls.reduce(
    (total, poll) => {

      const pollVotes = poll.options?.reduce(
        (sum, option) => sum + (option.votes || 0),
        0
      );

      return total + pollVotes;

    },
    0
  );

  return (
    <div className="dashboard-page">

      {/* ================= NAVBAR ================= */}

      <nav className="dashboard-navbar">

        <div className="dashboard-brand">

          <div className="brand-icon">
            📊
          </div>

          <span>Pollify</span>

        </div>

        <div className="dashboard-user">

          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="user-info">

            <strong>
              {user?.name || "User"}
            </strong>

            <small>
              {user?.email || "user@example.com"}
            </small>

          </div>

          <button
            className="logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ================= MAIN ================= */}

      <main className="dashboard-content">

        {/* HEADING */}

        <div className="dashboard-heading">

          <div>

            <p className="welcome-small">
              WELCOME BACK 👋
            </p>

            <h1>
              Hello,{" "}
              <span>
                {user?.name || "User"}
              </span>
              !
            </h1>

            <p>
              Create polls, collect opinions and make every voice count.
            </p>

          </div>

          <button
            className="create-poll-btn"
            onClick={onCreatePoll}
          >
            + Create New Poll
          </button>

        </div>


        {/* ================= STATS ================= */}

        <div className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              📊
            </div>

            <div>

              <span>
                Total Polls
              </span>

              <h2>
                {polls.length}
              </h2>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              👥
            </div>

            <div>

              <span>
                Total Responses
              </span>

              <h2>
                {totalResponses}
              </h2>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              🟢
            </div>

            <div>

              <span>
                Active Polls
              </span>

              <h2>
                {polls.length}
              </h2>

            </div>

          </div>

        </div>


        {/* ================= QUICK TEMPLATES ================= */}

        <section className="dashboard-section">

          <div className="section-title">

            <div>

              <h2>
                Quick Poll Templates
              </h2>

              <p>
                Start a poll quickly using a ready-made template.
              </p>

            </div>

          </div>


          <div className="template-grid">

            <div className="template-card">

              <div className="template-icon">
                🗳️
              </div>

              <h3>
                Yes / No
              </h3>

              <p>
                Simple yes or no questions.
              </p>

              <button onClick={() => onCreatePoll("yesno")}>
                Use Template →
              </button>

            </div>


            <div className="template-card">

              <div className="template-icon">
                ⭐
              </div>

              <h3>
                Rating Poll
              </h3>

              <p>
                Collect ratings from 1 to 5.
              </p>

              <button onClick={() => onCreatePoll("rating")}>
                Use Template →
              </button>

            </div>


            <div className="template-card">

              <div className="template-icon">
                🎓
              </div>

              <h3>
                 Feedback
              </h3>

              <p>
                Get quick student feedback.
              </p>

              <button onClick={onCreatePoll}>
                Use Template →
              </button>

            </div>

          </div>

        </section>


        {/* ================= YOUR POLLS ================= */}

        <section className="dashboard-section">

          <div className="section-title">

            <div>

              <h2>
                Your Polls
              </h2>

              <p>
                Polls created in Pollify.
              </p>

            </div>

          </div>


          {loading ? (

            <div className="empty-polls">

              <div className="empty-icon">
                ⏳
              </div>

              <h3>
                Loading your polls...
              </h3>

              <p>
                Please wait.
              </p>

            </div>

          ) : polls.length === 0 ? (

            <div className="empty-polls">

              <div className="empty-icon">
                📋
              </div>

              <h3>
                No polls created yet
              </h3>

              <p>
                Create your first live poll and start collecting responses.
              </p>

              <button
                className="empty-create-btn"
                onClick={onCreatePoll}
              >
                Create Your First Poll
              </button>

            </div>

          ) : (

            <div className="poll-list">

              {polls.map((poll) => {

                const votes =
                  poll.options?.reduce(
                    (sum, option) =>
                      sum + (option.votes || 0),
                    0
                  );

                return (

                  <div
                    className="poll-item"
                    key={poll.id}
                  >

                    <div className="poll-item-icon">
                      📊
                    </div>

                    <div className="poll-item-info">

                      <h3>
                        {poll.question}
                      </h3>

                      <p>
                        {poll.options?.length || 0} options
                        {" • "}
                        {votes} votes
                      </p>

                    </div>

                    <div className="poll-status">
                      LIVE
                    </div>
                    <button
                      className="view-results-btn"
                      onClick={() => onViewResults(poll.id)}
                    >
                      View Results
                    </button>

                  </div>

                );

              })}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;