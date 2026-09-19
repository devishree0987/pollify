package database

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var Client *mongo.Client

func ConnectMongoDB() error {

	// MongoDB local connection URL
	uri := "mongodb://localhost:27017"

	// MongoDB client create
	client, err := mongo.Connect(
		options.Client().ApplyURI(uri),
	)

	if err != nil {
		return err
	}

	// Connection check
	ctx, cancel := context.WithTimeout(
		context.Background(),
		10*time.Second,
	)

	defer cancel()

	err = client.Ping(ctx, nil)

	if err != nil {
		return err
	}

	Client = client

	fmt.Println("MongoDB connected successfully!")

	return nil
}