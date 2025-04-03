package handler

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/utiiz/dartbase/internal/model"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (h *Handler) SocketIO(manager *model.Manager, w http.ResponseWriter, r *http.Request) error {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade failed:", err)
		return err
	}

	log.Printf("New WebSocket connection: %s", conn.RemoteAddr().String())

	go manager.Read(conn)

	return nil
}
