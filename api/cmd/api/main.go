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

	manager := model.NewManager()

	h := handler.NewHandler()

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		se.Router.GET("/ws", func(e *core.RequestEvent) error {
			return h.SocketIO(manager, e.Response, e.Request)
		})

		// api := se.Router.Group("/api")
		// v1 := api.Group("/v1")
		//
		// v1.GET("/dartboard/{uuid}", func(e *core.RequestEvent) error {
		// 	return h.GetDartboard(e, manager)
		// })
		return se.Next()
	})
	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
