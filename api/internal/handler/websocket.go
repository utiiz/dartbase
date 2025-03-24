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
			log.Println("read error:", err)
			break
		}
		log.Printf("Received: %s", message)

		switch message.Type {
		case "INIT":
			rawData, _ := json.Marshal(message.Data)
			var data model.Init
			if err := json.Unmarshal(rawData, &data); err != nil {
				log.Println("read error:", err)
				break
			}
			log.Printf("Received: %s", data.UUID)
			cm.Register(data.UUID, conn)
		}
	}
	return nil
}
