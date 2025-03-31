package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/pocketbase/pocketbase/core"
	"github.com/utiiz/dartbase/internal/model"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (h *Handler) WS(e *core.RequestEvent, cm *model.ConnectionManager) error {
	conn, err := upgrader.Upgrade(e.Response, e.Request, nil)
	if err != nil {
		return err
	}
	defer conn.Close()

	for {
		var message model.Message
		if err := conn.ReadJSON(&message); err != nil {
			log.Println("here read error:", err)
			break
		}
		log.Printf("Received: %s", message)

		switch message.Type {
		case "INIT":
			rawData, _ := json.Marshal(message.Data)
			var data model.InitEvent
			if err := json.Unmarshal(rawData, &data); err != nil {
				log.Println("read error:", err)
				break
			}
			log.Printf("Received: %s", data.UUID)
			cm.Register(data.UUID, conn)
		case "START":
			rawData, _ := json.Marshal(message.Data)
			var data model.StartEvent
			if err := json.Unmarshal(rawData, &data); err != nil {
				log.Println("read error:", err)
				break
			}
			uuid := data.UUID
			log.Printf("Received: %s", data.UUID)
			event := model.Message{Type: "GAME_START"}
			d, err := json.Marshal(event)
			if err != nil {
				log.Print(err)
			}
			log.Printf("Sending: %s", d)

			cm.Send([]byte(d), uuid)
		}
	}
	return nil
}
