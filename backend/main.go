package main

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"polling-backend/handlers"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)


var client *mongo.Client

func connectMongoDB() {

	uri := "mongodb://localhost:27017"

	var err error

	client, err = mongo.Connect(
		options.Client().ApplyURI(uri),
	)

	if err != nil {
		panic(err)
	}

	ctx, cancel := context.WithTimeout(
		context.Background(),
		5*time.Second,
	)

	defer cancel()

	err = client.Ping(ctx, nil)

	if err != nil {
		panic(err)
	}

	fmt.Println("MongoDB connected successfully!")
}

func homeHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	fmt.Fprintln(w, `{
		"message": "Pollify Go Backend is running!"
	}`)
}

func main() {

	// Connect MongoDB
	connectMongoDB()

	// Select database and collection
	handlers.UserCollection =
		client.Database("pollify").Collection("users")

	handlers.PollCollection =
		client.Database("pollify").Collection("polls")

	// Home route
	http.HandleFunc("/", homeHandler)

	// Register API
	http.HandleFunc("/api/register", handlers.RegisterUser)

	// Login API
	http.HandleFunc("/api/login", handlers.LoginUser)

	// Create Poll + Get All Polls API
	http.HandleFunc("/api/polls", func(w http.ResponseWriter, r *http.Request) {

		if r.Method == http.MethodPost {
			handlers.CreatePoll(w, r)
			return
		}

		if r.Method == http.MethodGet {
			handlers.GetAllPolls(w, r)
			return
		}

		http.Error(
			w,
			"Method not allowed",
			http.StatusMethodNotAllowed,
		)
	})

	// Get Single Poll API
	http.HandleFunc("/api/poll", handlers.GetPoll)

	// Submit Vote API
	http.HandleFunc("/api/vote", handlers.SubmitVote)

	// Start server
	fmt.Println("Pollify backend running on http://localhost:8080")

	err := http.ListenAndServe(":8080", nil)

	if err != nil {
		fmt.Println("Server error:", err)
	}
}