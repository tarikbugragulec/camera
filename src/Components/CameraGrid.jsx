import React from 'react';
import axios from 'axios';
import Notification from './Notification';

function CameraGrid({ selectedCameras, captureSettings }) {
    const [loadingCameras, setLoadingCameras] = React.useState({});
    const [error, setError] = React.useState(null);

    const handleCapture = async (cameraId) => {
        const { interval, startDate, endDate } = captureSettings;

        setLoadingCameras((prevLoading) => ({
            ...prevLoading,
            [cameraId]: true,
        }));
        setError(null);

        try {
            await axios.post('http://localhost:5000/api/capture', {
                cameras: [selectedCameras.find(camera => camera.id === cameraId)],
                interval,
                start_time: startDate.toString(),
                end_time: endDate.toString()
            });
        } catch (error) {
            console.error('Error capturing images:', error);
            setError(getErrorMessage(error));
        } finally {
            setLoadingCameras((prevLoading) => ({
                ...prevLoading,
                [cameraId]: false,
            }));
        }
    };

    const getErrorMessage = (error) => {
        if (error.response) {
            return `Server error: ${error.response.data.message || error.response.status}`;
        } else if (error.request) {
            return 'No response from server. Please check if the server is running.';
        } else {
            return `Error: ${error.message}`;
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedCameras.length > 0 ? (
                    selectedCameras.map((camera) => (
                        <div key={camera.id} className="relative border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 bg-white p-4">
                            <img
                                className="w-[640] h-[800] object-cover"
                                src={camera.url}
                                alt={`${camera.id} yayını`}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = ""; // fallback image
                                }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-3 rounded-b-lg flex justify-between items-center">
                                <h4 className="text-lg font-semibold">{camera.id}</h4>
                                <button
                                    onClick={() => handleCapture(camera.id)}
                                    disabled={loadingCameras[camera.id]}
                                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition duration-200"
                                >
                                    {loadingCameras[camera.id] ? 'Çekim Yapılıyor...' : 'Görüntü Yakala'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center col-span-full text-lg font-semibold">Kamera(lar) Seçilmedi</p>
                )}
            </div>

            {error && (
                <Notification
                    message={error}
                    onClose={() => setError(null)}
                />
            )}
        </>
    );
}

export default CameraGrid;
