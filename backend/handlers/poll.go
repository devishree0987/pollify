package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"polling-backend/models"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

var PollCollection *mongo.Collection

// ===============================
// CREATE POLL
// ===============================
func CreatePoll(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var poll models.Poll

	err := json.NewDecoder(r.Body).Decode(&poll)

	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	if poll.Question == "" {
		http.Error(w, "Poll question is required", http.StatusBadRequest)
		return
	}

	if len(poll.Options) < 2 {
		http.Error(w, "At least 2 options are required", http.StatusBadRequest)
		return
	}

	// Generate Poll ID
	poll.ID = bson.NewObjectID()
	poll.CreatedAt = time.Now()

	// Initialize options
	for i := range poll.Options {

		poll.Options[i].Votes = 0

		if poll.Options[i].ID == "" {
			poll.Options[i].ID = bson.NewObjectID().Hex()
		}
	}

	ctx, cancel := context.WithTimeout(
		context.Background(),
		5*time.Second,
	)

	defer cancel()

	_, err = PollCollection.InsertOne(ctx, poll)

	if err != nil {
		http.Error(
			w,
			"Failed to create poll",
			http.StatusInternalServerError,
		)
		return
	}

	w.WriteHeader(http.StatusCreated)

	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Poll created successfully",
		"poll":    poll,
	})
}

// ===============================
// GET SINGLE POLL
// ===============================
func GetPoll(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pollID := r.URL.Query().Get("id")

	if pollID == "" {
		http.Error(w, "Poll ID is required", http.StatusBadRequest)
		return
	}

	objectID, err := bson.ObjectIDFromHex(pollID)

	if err != nil {
		http.Error(w, "Invalid poll ID", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(
		context.Background(),
		5*time.Second,
	)

	defer cancel()

	var poll models.Poll

	err = PollCollection.FindOne(
		ctx,
		bson.M{"_id": objectID},
	).Decode(&poll)

	if err != nil {

		if err == mongo.ErrNoDocuments {
			http.Error(w, "Poll not found", http.StatusNotFound)
			return
		}

		http.Error(
			w,
			"Failed to fetch poll",
			http.StatusInternalServerError,
		)
		return
	}

	json.NewEncoder(w).Encode(poll)
}

// ===============================
// SUBMIT VOTE
// ===============================
func SubmitVote(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var voteData struct {
		PollID    string   `json:"pollId"`
		OptionIDs []string `json:"optionIds"`
	}

	err := json.NewDecoder(r.Body).Decode(&voteData)

	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	if voteData.PollID == "" {
		http.Error(w, "Poll ID is required", http.StatusBadRequest)
		return
	}

	if len(voteData.OptionIDs) == 0 {
		http.Error(w, "Please select at least one option", http.StatusBadRequest)
		return
	}

	objectID, err := bson.ObjectIDFromHex(voteData.PollID)

	if err != nil {
		http.Error(w, "Invalid poll ID", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(
		context.Background(),
		5*time.Second,
	)

	defer cancel()

	// Find poll
	var poll models.Poll

	err = PollCollection.FindOne(
		ctx,
		bson.M{"_id": objectID},
	).Decode(&poll)

	if err != nil {
		http.Error(w, "Poll not found", http.StatusNotFound)
		return
	}

	// Check multiple choice
	if !poll.MultipleChoice && len(voteData.OptionIDs) > 1 {
		http.Error(
			w,
			"Only one option can be selected",
			http.StatusBadRequest,
		)
		return
	}

	// Update vote counts
	for _, selectedID := range voteData.OptionIDs {

		filter := bson.M{
			"_id":        objectID,
			"options.id": selectedID,
		}

		update := bson.M{
			"$inc": bson.M{
				"options.$.votes": 1,
			},
		}

		_, err = PollCollection.UpdateOne(
			ctx,
			filter,
			update,
		)

		if err != nil {
			http.Error(
				w,
				"Failed to submit vote",
				http.StatusInternalServerError,
			)
			return
		}
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Vote submitted successfully",
	})
}

// ===============================
// GET ALL POLLS
// ===============================
func GetAllPolls(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	ctx, cancel := context.WithTimeout(
		context.Background(),
		5*time.Second,
	)

	defer cancel()

	cursor, err := PollCollection.Find(
		ctx,
		bson.M{},
	)

	if err != nil {
		http.Error(
			w,
			"Failed to fetch polls",
			http.StatusInternalServerError,
		)
		return
	}

	defer cursor.Close(ctx)

	var polls []models.Poll

	err = cursor.All(ctx, &polls)

	if err != nil {
		http.Error(
			w,
			"Failed to read polls",
			http.StatusInternalServerError,
		)
		return
	}

	if polls == nil {
		polls = []models.Poll{}
	}

	json.NewEncoder(w).Encode(polls)
}
