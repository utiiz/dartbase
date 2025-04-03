package model

type MessageType string

const (
	// Dartboard -> Server
	DartboardConnected    MessageType = "DARTBOARD_CONNECTED"
	DartboardRegistered   MessageType = "DARTBOARD_REGISTERED"
	DartboardDisconnected MessageType = "DARTBOARD_DISCONNECTED"
	DartThrown            MessageType = "DART_THROWN"
	DartsRemoved          MessageType = "DARTS_REMOVED"

	// Server -> Dartboard
	StartDetection MessageType = "START_DETECTION"
	StopDetection  MessageType = "STOP_DETECTION"

	// Server -> Client
	GameCreated       MessageType = "GAME_CREATED"
	GameUpdated       MessageType = "GAME_UPDATED"
	GameStarted       MessageType = "GAME_STARTED"
	GameEnded         MessageType = "GAME_ENDED"
	ScoreUpdated      MessageType = "SCORE_UPDATED"
	PlayerTurnChanged MessageType = "PLAYER_TURN_CHANGED"

	// Client -> Server
	CreateGame MessageType = "CREATE_GAME"
	JoinGame   MessageType = "JOIN_GAME"
	LeaveGame  MessageType = "LEAVE_GAME"
	StartGame  MessageType = "START_GAME"
	EndGame    MessageType = "END_GAME"
)

// Message represents a WebSocket message
type Message struct {
	Type MessageType `json:"type"`
	Data any         `json:"data,omitempty"`
}
