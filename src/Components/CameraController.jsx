import React from 'react';

function CameraController({ allCameras, onSelectCamera, openAllCameras, closeAllCameras }) {
    const handleCameraChange = (event) => {
        const selectedCameraId = event.target.value;
        const selectedCamera = allCameras.find(camera => camera.id === selectedCameraId);
        if (selectedCamera) {
            onSelectCamera(selectedCamera);
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            {/* Dropdown */}
            <div className="relative">
                <select
                    className="block w-full appearance-none bg-white border border-gray-300 px-4 py-2 pr-8 rounded-md leading-tight focus:outline-none focus:border-blue-500"
                    onChange={handleCameraChange}
                >
                    <option value="">Select Camera</option>
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
        </div>
    );
}

export default CameraController;
