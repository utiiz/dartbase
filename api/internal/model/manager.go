package model

import (
	"encoding/json"
	"log"
	"sync"

	"github.com/gorilla/websocket"
)

type DBConnection struct {
	UUID   string
	GameID string
	Conn   *websocket.Conn
}

type GameConnection struct {
	ID            string
	DartboardUUID string
	Players       []*websocket.Conn
}

type Manager struct {
	Dartboards map[string]*DBConnection
	Games      map[string]*GameConnection
	Mutex      sync.Mutex
}

func NewManager() *Manager {
	return &Manager{
		Dartboards: make(map[string]*DBConnection),
		Games:      make(map[string]*GameConnection),
	}
}

func (m *Manager) Read(conn *websocket.Conn) {
	defer conn.Close()

	for {
		_, payload, err := conn.ReadMessage()
		if err != nil {
			break
		}

		var msg Message
		if err := json.Unmarshal(payload, &msg); err != nil {
			log.Println("Failed to unmarshal message:", err)
			continue
		}

		m.HandleMessage(conn, msg)
	}
}

func (m *Manager) HandleMessage(conn *websocket.Conn, msg Message) {
	switch msg.Type {
	case DartboardConnected:
		m.HandleDartboardConnected(conn, msg)
	case DartboardDisconnected:
		m.HandleDartboardDisconnected(conn, msg)
	case DartThrown:
		m.HandleDartThrown(conn, msg)
	case StartGame:
		m.HandleStartGame(conn, msg)
	}
}

func (m *Manager) HandleDartboardConnected(conn *websocket.Conn, msg Message) {
	data, ok := msg.Data.(map[string]any)
	if !ok {
		log.Println("HandleDartboardConnected - Invalid data:", msg.Data)
		return
	}

	uuid, ok := data["uuid"].(string)
	if !ok {
		log.Println("HandleDartboardConnected - Invalid UUID:", data["uuid"])
		return
	}

	m.Mutex.Lock()
	defer m.Mutex.Unlock()

	m.Dartboards[uuid] = &DBConnection{
		UUID: uuid,
		Conn: conn,
	}

	for _, c := range m.Dartboards {
		log.Println("Dartboard connected:", c.UUID)
	}
}

func (m *Manager) HandleDartboardDisconnected(conn *websocket.Conn, msg Message) {
	data, ok := msg.Data.(map[string]any)
	if !ok {
		log.Println("HandleDartboardDisconnected - Invalid data:", msg.Data)
		return
	}

	uuid, ok := data["uuid"].(string)
	if !ok {
		log.Println("HandleDartboardDisconnected - Invalid UUID:", data["uuid"])
		return
	}

	m.Mutex.Lock()
	defer m.Mutex.Unlock()

	delete(m.Dartboards, uuid)
}

func (m *Manager) HandleStartGame(conn *websocket.Conn, msg Message) {
	log.Println("HandleStartGame", msg.Data)
	data, ok := msg.Data.(map[string]any)
	if !ok {
		log.Println("HandleStartGame - Invalid data:", msg.Data)
		return
	}

	uuid, ok := data["uuid"].(string)
	if !ok {
		log.Println("HandleStartGame - Invalid UUID:", data["uuid"])
		return
	}

	gameID, ok := data["game_id"].(string)
	if !ok {
		log.Println("HandleStartGame - Invalid UUID:", data["uuid"])
		return
	}

	dartboard, ok := m.Dartboards[uuid]
	if !ok {
		log.Println("HandleStartGame - Dartboard not found:", uuid)
		return
	}
	m.Mutex.Lock()
	defer m.Mutex.Unlock()
	dartboard.GameID = gameID

	game, ok := m.Games[gameID]
	if ok {
		game.Players = append(game.Players, conn)
	} else {
		m.Games[gameID] = &GameConnection{
			ID:            gameID,
			DartboardUUID: dartboard.UUID,
			Players:       []*websocket.Conn{conn},
		}
	}

	for _, c := range m.Dartboards {
		log.Println("Dartboard connected:", c.UUID)
	}

	for _, c := range m.Games {
		log.Println("Game connected:", c.ID, c.Players, c.DartboardUUID)
	}

	msg = Message{
		Type: StartDetection,
		Data: nil,
	}
	if err := m.Send(dartboard.Conn, msg); err != nil {
		log.Println("Failed to send message:", err)
	}
}

func (m *Manager) HandleDartThrown(conn *websocket.Conn, msg Message) {
	data, ok := msg.Data.(map[string]any)
	if !ok {
		log.Println("HandleDartThrown - Invalid data:", msg.Data)
		return
	}

	uuid, ok := data["uuid"].(string)
	if !ok {
		log.Println("HandleDartThrown - Invalid UUID:", data["uuid"])
		return
	}

	dartboard, ok := m.Dartboards[uuid]
	if !ok {
		log.Println("HandleDartThrown - Dartboard not found:", uuid)
		return
	}

	msg = Message{
		Type: DartThrown,
		Data: data,
	}
	game, ok := m.Games[dartboard.GameID]
	if ok {
		for _, c := range game.Players {
			if c != conn {
				if err := m.Send(c, msg); err != nil {
					log.Println("Failed to send message:", err)
				}
			}
		}
	}
}

func (m *Manager) Send(conn *websocket.Conn, msg Message) error {
	data, err := json.Marshal(msg)
	if err != nil {
		log.Println("Failed to marshal message:", err)
		return err
	}

	return conn.WriteMessage(websocket.TextMessage, data)
}
