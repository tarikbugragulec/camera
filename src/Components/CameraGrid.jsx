import React, { useState } from 'react';
import axios from 'axios';

function CameraGrid({ selectedCameras }) {
    const [captureInterval, setCaptureInterval] = useState(5);
    const [captureCount, setCaptureCount] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCapture = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await axios.post('http://localhost:5000/api/capture', {
                cameras: selectedCameras,
                interval: captureInterval,
                count: captureCount
            });
            // Başarılı işlem bildirimi kaldırıldı
        } catch (error) {
            console.error('Error capturing images:', error);
            if (error.response) {
                setError(`Server error: ${error.response.data.message || error.response.status}`);
            } else if (error.request) {
                setError('No response received from server. Please check if the server is running.');
            } else {
                setError(`Error: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Capture Interval (seconds)</label>
                <input
                    type="number"
                    value={captureInterval}
                    onChange={(e) => setCaptureInterval(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Number of Captures</label>
                <input
                    type="number"
                    value={captureCount}
                    onChange={(e) => setCaptureCount(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <button
                onClick={handleCapture}
                disabled={isLoading}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
                {isLoading ? 'Capturing...' : 'Capture Images'}
            </button>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {selectedCameras.length > 0 ? (
                    selectedCameras.map((camera) => (
                        <div key={camera.id} className="relative border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 bg-white p-4">
                            <img
                                className="w-full h-full object-cover"
                                src={camera.url}
                                alt={`Feed from ${camera.id}`}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = ""; // fallback image
                                }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-3 rounded-b-lg">
                                <h4 className="text-lg font-semibold">{camera.id}</h4>
                                <p className="text-sm">URL: {camera.url}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center col-span-full text-lg font-semibold">Kamera(lar) Seçilmedi</p>
                )}
            </div>
        </div>
    );
}

export default CameraGrid;