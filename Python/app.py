import requests
import os
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from urllib.parse import urlparse, urlunparse

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# Fotoğrafların kaydedileceği ana klasör
PHOTOS_DIR = r"C:\Users\tarik\OneDrive\Masaüstü\React\camera\Photos"

def capture_image(camera_url, folder_name):
    try:
        # Parse the URL
        parsed_url = urlparse(camera_url)
        
        # Remove port from netloc
        netloc = parsed_url.hostname
        
        # Replace 'stream' with 'capture' in the path and remove any port
        path_parts = parsed_url.path.split('/')
        if 'stream' in path_parts:
            path_parts[path_parts.index('stream')] = 'capture'
        new_path = '/'.join(path_parts)
        
        # Reconstruct the URL with 'capture' and without port
        capture_url = urlunparse(parsed_url._replace(netloc=netloc, path=new_path))
        
        print(f"Capturing image from: {capture_url}")
        response = requests.get(capture_url)
        
        if response.status_code == 200:
            # Ana klasör altında kamera için alt klasör oluştur
            camera_folder = os.path.join(PHOTOS_DIR, folder_name)
            os.makedirs(camera_folder, exist_ok=True)
            
            # Fotoğrafı kaydet
            timestamp = time.perf_counter()  # Daha hassas zaman almak için
            image_path = os.path.join(camera_folder, f"{timestamp:.3f}.jpg")  # Milisaniye ile kaydet
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

@app.route('/api/capture', methods=['POST'])
def capture_images():
    print("Received capture request")
    data = request.json
    print(f"Request data: {data}")
    
    cameras = data.get('cameras', [])
    interval = data.get('interval', 5)
    count = data.get('count', 1)

    if not cameras:
        return jsonify({"message": "No cameras provided"}), 400

    for camera in cameras:
        folder_name = f"camera_{camera['id']}"
        for i in range(count):
            print(f"Capturing image {i+1}/{count} for camera {camera['id']}")
            success = capture_image(camera['url'], folder_name)
            if not success:
                return jsonify({"message": f"Error capturing image from camera {camera['id']}"}), 500
            time.sleep(interval)

    return jsonify({"message": "Images captured successfully"}), 200

if __name__ == '__main__':
    # Ana klasörü oluştur (eğer yoksa)
    os.makedirs(PHOTOS_DIR, exist_ok=True)
    app.run(debug=True)
