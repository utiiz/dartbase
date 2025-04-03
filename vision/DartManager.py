import os
from os.path import join, dirname
from dotenv import load_dotenv
import cv2
import json
from threading import Thread
from DartDetector import DartDetector, State
from WebSocket import WebSocket, Message, MessageType
from Triangulator import Triangulator, Camera
from Dartboard import Dartboard


class Dart:
    def __init__(self, x_1=None, x_2=None):
        self.x_1 = x_1
        self.x_2 = x_2

    def clear(self):
        self.x_1 = None
        self.x_2 = None


class DartManager:
    def __init__(self, dartboard, websocket, frame_rate=30, debug=False):
        self.dart = None
        self.dartboard = dartboard
        self.websocket = websocket
        self.frame_rate = frame_rate
        self.debug = debug

    def update(self):
        detector1 = DartDetector(
            video_source='./videos/CAM_01_03.mp4',
            dartboard_line=347, frame_rate=self.frame_rate, debug=self.debug)
        detector2 = DartDetector(
            video_source='./videos/CAM_02_03.mp4',
            dartboard_line=330, frame_rate=self.frame_rate, debug=self.debug)

        camera_a = Camera(angle=45, fov=73.4)
        camera_b = Camera(angle=135, fov=73.4)
        triangulator = Triangulator(radius=45, width=1280)

        triangulator.add_camera(camera_a)
        triangulator.add_camera(camera_b)

        dart = Dart()
        ok = False
        while True:
            detector1.process_frame()
            detector2.process_frame()

            if ok and detector1.state == State.EMPTY and detector2.state == State.EMPTY:
                self.send_removing_darts()
                ok = False
                continue

            if detector1.dart is not None:
                dart.x_1 = detector1.dart.x
            if detector2.dart is not None:
                dart.x_2 = detector2.dart.x

            if dart.x_1 is not None and dart.x_2 is not None:
                ok = True
                coordinates = triangulator.get_position(dart.x_1, dart.x_2)
                score = triangulator.get_score(coordinates[0], coordinates[1])
                self.dartboard.update_dart_position(
                    coordinates[0], coordinates[1])
                self.send_dart(coordinates, score)
                dart.clear()

            # Break the loop on 'q' key press
            if cv2.waitKey(30) & 0xFF == ord('q'):
                break

        # Release the resources
        detector1.release()
        detector2.release()

    def send_removing_darts(self):
        message = Message(type=MessageType.DARTS_REMOVED, data=None)
        print(message.to_json())
        self.websocket.ws.send(message.to_json())

    def send_dart(self, coordinates, score):
        message = Message(type=MessageType.DART_THROWN,
                          data=dict(uuid=self.websocket.UUID, coordinates=coordinates, score=score))
        print(message.to_json())
        self.websocket.ws.send(message.to_json())

    def on_message(self, ws, message):
        print(f"Received message: {message}")
        message = json.loads(message, object_hook=lambda d: Message(**d))
        if message.type == MessageType.START_DETECTION:
            Thread(target=self.update, daemon=True).start()

    def shutdown(self):
        """Properly shut down all components"""
        print("Shutting down DartManager...")
        self.running.clear()  # Signal threads to stop

        # Clean up detectors
        for detector in self.detectors:
            if detector:
                detector.release()

        # Clear any remaining data
        if hasattr(self, 'dart'):
            self.dart = None


def main():
    env_path = join(dirname(__file__), ".env")
    load_dotenv(env_path)
    UUID = os.environ.get("UUID")

    dartboard = Dartboard()

    ws = WebSocket(UUID)
    dart_manager = DartManager(dartboard=dartboard, websocket=ws, debug=True)

    ws.on_message = dart_manager.on_message

    ws_thread = Thread(target=ws.start, daemon=True)
    ws_thread.start()

    dartboard.start()


if __name__ == "__main__":
    main()
