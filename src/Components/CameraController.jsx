import React, { useState } from 'react';
import axios from 'axios';

function CameraController({ allCameras, onSelectCamera, openAllCameras, closeAllCameras, selectedCameras }) {
    // State declarations for capture settings
    const [captureInterval, setCaptureInterval] = useState(5);
    const [captureCount, setCaptureCount] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handle image capture
    const handleCapture = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await axios.post('http://localhost:5000/api/capture', {
                cameras: selectedCameras,
                interval: captureInterval,
                count: captureCount
            });
            // You can add a success message here if needed
        } catch (error) {
            console.error('Error capturing images:', error);
            setError(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to get error message
    const getErrorMessage = (error) => {
        if (error.response) {
            return `Server error: ${error.response.data.message || error.response.status}`;
        } else if (error.request) {
            return 'No response received from server. Please check if the server is running.';
        } else {
            return `Error: ${error.message}`;
        }
    };


    return (
        <div className="flex flex-col space-y-4">
            {/* Dropdown for camera selection */}
            <div className="relative">
                <select
                    className="block w-full appearance-none bg-white border border-gray-300 px-4 py-2 pr-8 rounded-md leading-tight focus:outline-none focus:border-blue-500"
                    onChange={(e) => onSelectCamera(allCameras.find(camera => camera.id === e.target.value))}
                >
                    <option value="">Kamera Seçin</option>
                    {allCameras.map((camera) => (
                        <option key={camera.id} value={camera.id}>{camera.id}</option>
                    ))}
                </select>
            </div>

            {/* Open All & Close All Buttons */}
            <div className="flex justify-between">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex-1 mr-2"
                    onClick={openAllCameras}
                >
                    Tüm Kameraları Aç
                </button>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex-1 ml-2"
                    onClick={closeAllCameras}
                >
                    Tüm Kameraları Kapat
                </button>
            </div>
            {/* Error message */}
            {error && <p className="text-red-500 mb-4">{error}</p>}
        </div>
    );
}

export default CameraController;
