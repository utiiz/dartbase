package handler

import (
	"net/http"

	"github.com/pocketbase/pocketbase/core"
	"github.com/utiiz/dartbase/internal/model"
)

func (h *Handler) GetDartboard(e *core.RequestEvent, cm *model.ConnectionManager) error {
	uuid := e.Request.PathValue("uuid")

	_, exists := cm.GetClient(uuid)
	return e.JSON(http.StatusOK, map[string]bool{"connected": exists})
}
