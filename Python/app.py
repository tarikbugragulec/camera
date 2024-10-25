import requests
import os
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from urllib.parse import urlparse, urlunparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Directory where photos will be saved
PHOTOS_DIR = r"C:\Users\tarik\OneDrive\Masaüstü\React\camera\Photos"

def capture_image(camera_url, camera_id):
    try:
        parsed_url = urlparse(camera_url)
        netloc = parsed_url.hostname
        path_parts = parsed_url.path.split('/')

        if 'stream' in path_parts:
            path_parts[path_parts.index('stream')] = 'capture'
        new_path = '/'.join(path_parts)
        capture_url = urlunparse(parsed_url._replace(netloc=netloc, path=new_path))

        print(f"Capturing image from: {capture_url}")
        response = requests.get(capture_url)

        if response.status_code == 200:
            camera_folder = os.path.join(PHOTOS_DIR, camera_id)  # Klasör adı sadece kamera ID'si
            os.makedirs(camera_folder, exist_ok=True)

            # Kamera adı ve tarih bazında dosya adı oluştur
            timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
            image_path = os.path.join(camera_folder, f"{timestamp}.jpg")
            with open(image_path, 'wb') as f:
                f.write(response.content)

            print(f"Image successfully saved: {image_path}")
            return True
        else:
            print(f"Failed to capture image from {capture_url}. Status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"Error capturing image from {capture_url}: {e}")
        return False

def capture_images_for_camera(cameras, interval, start_time, end_time):
    for camera in cameras:
        current_time = start_time

        while current_time < end_time:
            print(f"Capturing image for camera {camera['id']} at {current_time}")
            try:
                success = capture_image(camera['url'], camera['id'])  # Yalnızca kamera ID'si gönder
                if not success:
                    print(f"Error capturing image for camera {camera['id']}")
                    return False
            except Exception as e:
                print(f"Error during image capture for camera {camera['id']}: {e}")
                return False

            time.sleep(interval)  # Wait for the specified interval
            current_time = datetime.now()  # Update current time for the next iteration

    return True


@app.route('/api/capture', methods=['POST'])
def capture_images():
    print("Received capture request")
    data = request.json
    print(f"Request data: {data}")

    cameras = data.get('cameras', [])
    interval = data.get('interval', 5)
    
    # Handle datetime conversion with error checking
    try:
        start_time = datetime.fromisoformat(data.get('start_time'))
        end_time = datetime.fromisoformat(data.get('end_time'))
    except (TypeError, ValueError) as e:
        return jsonify({"message": "Invalid datetime format"}), 400

    if not cameras:
        return jsonify({"message": "No cameras provided"}), 400

    # Use ThreadPoolExecutor to handle multiple cameras simultaneously
    with ThreadPoolExecutor() as executor:
        # Submit all camera capture tasks to the executor
        futures = [executor.submit(capture_images_for_camera, cameras, interval, start_time, end_time)]

        # Collect results
        for future in as_completed(futures):
            result = future.result()
            if not result:
                return jsonify({"message": "Error capturing images"}), 500

    return jsonify({"message": "Fotoğraflar Başarıyla Kaydedildi"}), 200

@app.route('/api/schedule', methods=['POST'])
def schedule_capture():
    print("Received schedule request")
    data = request.json
    cameras = data.get('cameras', [])
    interval = data.get('interval', 5)
    
    # Handle datetime conversion with error checking
    try:
        start_time = datetime.fromisoformat(data.get('start_time'))
        end_time = datetime.fromisoformat(data.get('end_time'))
    except (TypeError, ValueError) as e:
        return jsonify({"message": "Geçersiz Tarih Formatı"}), 400

    if not cameras:
        return jsonify({"message": "NKamera Yok"}), 400

    # Schedule the capture in a new thread
    threading.Thread(target=capture_images_for_camera, args=(cameras, interval, start_time, end_time)).start()

    return jsonify({"message": "Fotoğraf Yakalama Başarılı"}), 200

if __name__ == '__main__':
    app.run(debug=True)
