import os
from os.path import join, dirname
from dotenv import load_dotenv
import websocket
import time
import json
import threading


class MessageType:
    DARTBOARD_CONNECTED = "DARTBOARD_CONNECTED"
    DARTBOARD_DISCONNECTED = "DARTBOARD_DISCONNECTED"
    DART_THROWN = "DART_THROWN"
    DARTS_REMOVED = "DARTS_REMOVED"

    START_DETECTION = "START_DETECTION"
    STOP_DETECTION = "STOP_DETECTION"


class Message:
    def __init__(self, type, data=None):
        self.type = type
        self.data = data

    def to_json(self):
        return json.dumps(self.__dict__)


class WebSocket:
    def __init__(self, UUID, on_message=None):
        self.UUID = UUID
        self.on_message = on_message
        self.ws = websocket.WebSocketApp("ws://127.0.0.1:8090/ws",
                                         on_open=self.on_open,
                                         on_message=self.on_message_handler,
                                         on_error=self.on_error,
                                         on_close=self.on_close)

    def start(self):
        self.ws.run_forever()

    def on_error(self, ws, error):
        print(f"Error occurred: {error}")

    def on_message_handler(self, ws, message):
        if self.on_message is not None:
            self.on_message(ws, message)

    def on_open(self, ws):
        print("Connection successfully opened")

        msg = Message(type=MessageType.DARTBOARD_CONNECTED,
                      data=dict(uuid=self.UUID))
        print(msg.to_json())
        ws.send(msg.to_json())

    def on_close(self, ws, close_status_code, close_msg):
        print(f"Connection closed: {close_status_code} - {close_msg}")
        self.ws.close()


if __name__ == "__main__":
    print("Starting program")
    env_path = join(dirname(__file__), ".env")
    load_dotenv(env_path)
    UUID = os.environ.get("UUID")
    ws = WebSocket(UUID)
    ws_thread = threading.Thread(target=ws.start, daemon=True)
    ws_thread.start()

    # Keep main thread alive
    while True:
        time.sleep(5)
