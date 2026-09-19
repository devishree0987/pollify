import { useState } from "react";
import "./App.css";

function CreatePoll({ onBack, template }) {

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(
  template === "rating"
    ? ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"]
    : template === "yesno"
    ? ["Yes", "No"]
    : ["", ""]
);
  const [multipleChoice, setMultipleChoice] = useState(false);
  const [anonymous, setAnonymous] = useState(false);

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const updateOption = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const removeOption = (index) => {
    if (options.length <= 2) return;

    setOptions(options.filter((_, i) => i !== index));
  };

  const handleCreatePoll = async (e) => {
  e.preventDefault();

  const validOptions = options.filter(
    (option) => option.trim() !== ""
  );

  if (!question.trim()) {
    alert("Please enter a poll question");
    return;
  }

  if (validOptions.length < 2) {
    alert("Please add at least 2 options");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:8080/api/polls",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
          options: validOptions.map((option) => ({
            text: option,
            votes: 0,
          })),
          multipleChoice: multipleChoice,
          anonymous: anonymous,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("Created Poll:", data);

      alert("Poll created successfully! 🎉");

      setQuestion("");
      setOptions(
        template === "rating"
         ? ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"]
        : ["", ""]
    );
      setMultipleChoice(false);
      setAnonymous(false);

      onBack();
    } else {
      alert(data);
    }

  } catch (error) {
    console.error(error);
    alert("Cannot connect to Go backend");
  }
};

  return (
    <div className="create-poll-page">

      {/* Navbar */}
      <nav className="dashboard-navbar">

        <div className="dashboard-brand">
          <div className="brand-icon">📊</div>
          <span>Pollify</span>
        </div>

        <button
          className="back-btn"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

      </nav>

      {/* Content */}
      <main className="create-poll-content">

        <div className="create-poll-header">

          <p>CREATE A NEW POLL</p>

          <h1>
            Ask. Vote. <span>Decide.</span>
          </h1>

          <p className="subtitle">
            Create a live poll and start collecting opinions.
          </p>

        </div>

        <form
          className="poll-form"
          onSubmit={handleCreatePoll}
        >

          {/* Question */}
          <div className="form-section">

            <label>Poll Question</label>

            <input
              type="text"
              placeholder="What would you like to ask?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

          </div>

          {/* Options */}
          <div className="form-section">

            <div className="option-heading">
              <label>Answer Options</label>

              <span>
                {options.length} options
              </span>
            </div>

            {options.map((option, index) => (

              <div
                className="option-row"
                key={index}
              >

                <span className="option-number">
                  {index + 1}
                </span>

                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) =>
                    updateOption(index, e.target.value)
                  }
                />

                {options.length > 2 && (
                  <button
                    type="button"
                    className="remove-option"
                    onClick={() => removeOption(index)}
                  >
                    ×
                  </button>
                )}

              </div>

            ))}

            <button
              type="button"
              className="add-option-btn"
              onClick={addOption}
            >
              + Add another option
            </button>

          </div>

          {/* Settings */}
          <div className="form-section">

            <label>Poll Settings</label>

            <div className="setting-card">

              <label className="setting-row">

                <div>
                  <strong>Multiple choice</strong>
                  <small>
                    Allow voters to select more than one option
                  </small>
                </div>

                <input
                  type="checkbox"
                  checked={multipleChoice}
                  onChange={(e) =>
                    setMultipleChoice(e.target.checked)
                  }
                />

              </label>

              <label className="setting-row">

                <div>
                  <strong>Anonymous voting</strong>
                  <small>
                    Hide voter identity from poll creator
                  </small>
                </div>

                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) =>
                    setAnonymous(e.target.checked)
                  }
                />

              </label>

            </div>

          </div>

          {/* Create */}
          <button
            type="submit"
            className="create-final-btn"
          >
            Create Live Poll →
          </button>

        </form>

      </main>

    </div>
  );
}

export default CreatePoll;