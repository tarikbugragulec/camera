import React, { useState } from 'react';
import CameraGrid from './Components/CameraGrid';
import CameraController from './Components/CameraController';

function App() {
  const [selectedCameras, setSelectedCameras] = useState([]);
  const [allCameras] = useState([
    { id: 'Camera1', url: 'http://192.168.1.71:81/stream' }
  ]);

  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [captureSettings, setCaptureSettings] = useState({ interval: 5, count: 1 });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSelectCamera = (camera) => {
    setSelectedCameras([camera]);
  };

  const openAllCameras = () => {
    setSelectedCameras(allCameras);
  };

  const closeAllCameras = () => {
    setSelectedCameras([]);
  };

  const toggleNavbar = () => {
    setIsNavbarOpen(prevState => !prevState);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(prevState => !prevState);
  };

  const handleSaveSettings = () => {
    // Logic for saving settings if needed can be added here
    setIsSettingsOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
          onClick={toggleNavbar}
        >
          Kamera Kontrolü {isNavbarOpen ? 'Kapat' : 'Aç'}
        </button>

        {/* Capture Settings Button */}
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
          onClick={toggleSettings}
        >
          Capture Settings
        </button>
      </div>

      {isNavbarOpen && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
          <CameraController
            allCameras={allCameras}
            onSelectCamera={handleSelectCamera}
            openAllCameras={openAllCameras}
            closeAllCameras={closeAllCameras}
            selectedCameras={selectedCameras} // Pass the selected cameras
          />
        </div>
      )}

      <h2 className='text-2xl text-center mb-4'>Kamera Yönetim Sistemi</h2>

      <CameraGrid selectedCameras={selectedCameras} captureSettings={captureSettings} />

      {/* Capture Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-100 p-4 rounded-lg shadow-md w-1/3">
            <h3 className="text-lg font-semibold mb-2">Capture Settings</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Çekim Aralığı (saniye)</label>
              <input
                value={captureSettings.interval}
                onChange={(e) => setCaptureSettings({ ...captureSettings, interval: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Çekim Sayısı</label>
              <input
                value={captureSettings.count}
                onChange={(e) => setCaptureSettings({ ...captureSettings, count: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 " // Center text for the count input
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleSaveSettings}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
              >
                Save Settings
              </button>
              <button
                onClick={toggleSettings}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
