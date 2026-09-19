
package models
import (
    "go.mongodb.org/mongo-driver/bson/primitive"
)
import "time"

type User struct {
    ID               primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    Name             string             `bson:"name" json:"name"`
    Email            string             `bson:"email" json:"email"`
    Password         string             `bson:"password" json:"-"`
    ResetTokenHash   string             `bson:"resetTokenHash,omitempty" json:"-"`
    ResetTokenExpiry time.Time          `bson:"resetTokenExpiry,omitempty" json:"-"`
}