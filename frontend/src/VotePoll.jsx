import { useEffect, useState } from "react";
import "./App.css";

function VotePoll({ pollId, onBack }) {

  const [poll, setPoll] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // GET POLL
  // =========================
  const fetchPoll = async () => {

    try {

      const response = await fetch(
        `http://localhost:8080/api/poll?id=${pollId}`
      );

      if (!response.ok) {
        throw new Error("Poll not found");
      }

      const data = await response.json();

      setPoll(data);
      setError("");

    } catch (error) {

      console.error(error);
      setError("Unable to load this poll.");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    if (pollId) {
      fetchPoll();
    }

  }, [pollId]);

  // =========================
  // SELECT OPTION
  // =========================
  const handleOptionChange = (optionId) => {

    if (poll.multipleChoice) {

      setSelectedOptions((previous) => {

        if (previous.includes(optionId)) {

          return previous.filter(
            (id) => id !== optionId
          );

        }

        return [...previous, optionId];

      });

    } else {

      setSelectedOptions([optionId]);

    }
  };

  // =========================
  // SUBMIT VOTE
  // =========================
  const handleVote = async () => {

    if (selectedOptions.length === 0) {
      alert("Please select an option.");
      return;
    }

    setSubmitting(true);

    try {

      const response = await fetch(
        "http://localhost:8080/api/vote",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pollId: pollId,
            optionIds: selectedOptions,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data);
        return;
      }

      setVoted(true);

      alert("Your vote has been submitted! 🎉");

    } catch (error) {

      console.error(error);
      alert("Cannot connect to backend.");

    } finally {

      setSubmitting(false);

    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (
      <div className="vote-page">

        <div className="vote-loading">

          <div className="loading-icon">
            📊
          </div>

          <h2>Loading Poll...</h2>

          <p>Please wait.</p>

        </div>

      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error || !poll) {

    return (
      <div className="vote-page">

        <div className="vote-error">

          <div className="error-icon">
            ⚠️
          </div>

          <h2>Poll Not Found</h2>

          <p>
            This poll may have been deleted or the link is invalid.
          </p>

          <button
            className="back-dashboard-btn"
            onClick={onBack}
          >
            ← Back
          </button>

        </div>

      </div>
    );
  }

  // =========================
  // VOTED SCREEN
  // =========================
  if (voted) {

    return (
      <div className="vote-page">

        <div className="vote-success">

          <div className="success-icon">
            ✓
          </div>

          <p className="success-label">
            VOTE SUBMITTED
          </p>

          <h1>
            Thanks for <span>voting!</span>
          </h1>

          <p>
            Your response has been recorded successfully.
          </p>

          <button
            className="back-dashboard-btn"
            onClick={onBack}
          >
            ← Back to Pollify
          </button>

        </div>

      </div>
    );
  }

  // =========================
  // VOTING PAGE
  // =========================
  return (
    <div className="vote-page">

      <nav className="vote-navbar">

        <div className="dashboard-brand">

          <div className="brand-icon">
            📊
          </div>

          <span>Pollify</span>

        </div>

        <div className="live-badge">
          ● LIVE POLL
        </div>

      </nav>

      <main className="vote-content">

        <div className="vote-card">

          <div className="vote-card-top">

            <span className="poll-label">
              POLL
            </span>

            <span className="vote-count">
              {poll.options.length} options
            </span>

          </div>

          <h1 className="vote-question">
            {poll.question}
          </h1>

          <p className="vote-instruction">

            {poll.multipleChoice
              ? "Select one or more options"
              : "Select one option"}

          </p>

          <div className="vote-options">

            {poll.options.map((option, index) => {

              const isSelected =
                selectedOptions.includes(option.id);

              return (
                <button
                  key={option.id}
                  className={`vote-option ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() =>
                    handleOptionChange(option.id)
                  }
                >

                  <div className="option-left">

                    <div className="vote-option-number">
                      {index + 1}
                    </div>

                    <span>
                      {option.text}
                    </span>

                  </div>

                  <div className="selection-icon">

                    {isSelected ? "✓" : ""}

                  </div>

                </button>
              );

            })}

          </div>

          <button
            className="submit-vote-btn"
            onClick={handleVote}
            disabled={submitting}
          >

            {submitting
              ? "Submitting..."
              : "Submit My Vote →"}

          </button>

          <p className="vote-footer">
            Your response matters. Make your voice count.
          </p>

        </div>

      </main>

    </div>
  );
}

export default VotePoll;