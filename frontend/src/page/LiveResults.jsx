import React, { useEffect, useState } from "react";
import "./LiveResults.css";


function LiveResults({ pollId, onBack }) {

  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // =========================
// SHARE POLL
// =========================
const handleShare = async () => {

  const shareUrl =
    `${window.location.origin}/?poll=${pollId}`;

  try {

    await navigator.clipboard.writeText(shareUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);

  } catch (error) {

    console.error("Copy failed:", error);

    alert("Unable to copy poll link");

  }
};


  const fetchPoll = async () => {

    if (!pollId) {
      setError("Poll ID not found");
      setLoading(false);
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:8080/api/poll?id=${pollId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch poll");
      }

      const data = await response.json();

      setPoll(data);
      setError("");

    } catch (err) {

      console.error(err);
      setError("Unable to load poll results");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchPoll();

    const interval = setInterval(() => {
      fetchPoll();
    }, 2000);

    return () => clearInterval(interval);

  }, [pollId]);


  if (loading) {
    return (
      <div className="results-page">
        <div className="results-loading">
          Loading results...
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="results-page">

        <div className="results-error">
          {error}
        </div>

        <button
          className="back-btn"
          onClick={onBack}
        >
          ← Dashboard
        </button>

      </div>
    );
  }


  if (!poll) {
    return null;
  }


  const totalVotes = poll.options.reduce(
    (total, option) => total + (option.votes || 0),
    0
  );
  const chartData = poll.options.map((option) => ({
    name: option.text,
   votes: option.votes || 0
 }));

  return (

    <div className="results-page">

      {/* HEADER */}

      <div className="results-header">

  <div>

    <p className="results-label">
      POLLIFY LIVE RESULTS
    </p>

    <h1>
      Live Results
    </h1>

    <p className="results-subtitle">
      Watch the votes update in real time.
    </p>

  </div>

  <div className="results-actions">

    <button
      className="share-poll-btn"
      onClick={handleShare}
    >
      {copied ? "✓ Link Copied!" : "📋 Share Poll"}
    </button>

    <button
      className="back-btn"
      onClick={onBack}
    >
      ← Dashboard
    </button>

  </div>

</div>


      {/* RESULT CARD */}

      <div className="results-card">

        <div className="question-section">

          <span className="live-badge">
            ● LIVE
          </span>

          <h2>
            {poll.question}
          </h2>

        </div>


        {/* TOTAL VOTES */}

        <div className="total-votes-box">

          <span>
            Total Votes
          </span>

          <strong>
            {totalVotes}
          </strong>

        </div>


        {/* OPTIONS */}

        <div className="options-results">

          {poll.options.map((option) => {

            const votes = option.votes || 0;

            const percentage =
              totalVotes === 0
                ? 0
                : Math.round(
                    (votes / totalVotes) * 100
                  );


            return (

              <div
                className="result-option"
                key={option.id}
              >

                <div className="option-top">

                  <span className="option-name">
                    {option.text}
                  </span>

                  <span className="option-votes">
                    {votes} vote
                    {votes !== 1 ? "s" : ""}
                    {" "}
                    ({percentage}%)
                  </span>

                </div>


                <div className="progress-track">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${percentage}%`
                    }}
                  >

                    {percentage >= 10 && (
                      <span>
                        {percentage}%
                      </span>
                    )}

                  </div>

                </div>

              </div>

            );

          })}

        </div>


        {/* FOOTER */}

        <div className="results-footer">

          <span>
            🔄 Results update automatically
          </span>

          <button
            className="refresh-btn"
            onClick={fetchPoll}
          >
            Refresh
          </button>

        </div>

      </div>

    </div>

  );
}

export default LiveResults;