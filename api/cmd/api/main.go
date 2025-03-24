package main

import (
	"log"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/utiiz/dartbase/internal/handler"
	"github.com/utiiz/dartbase/internal/model"
)

func main() {
	app := pocketbase.New()
	app.RootCmd.PersistentFlags().Set("dir", "./pb_data")

	cm := model.NewConnectionManager()
	h := handler.NewHandler()

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		se.Router.GET("/ws", func(e *core.RequestEvent) error {
			return h.WS(e, cm)
		})

		_ = se.Router.Group("/v1")
		return se.Next()
	})
	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
