import React, { useState } from 'react';
import CameraGrid from './Components/CameraGrid';
import CameraController from './Components/CameraController';

function App() {
  const [selectedCameras, setSelectedCameras] = useState([]);
  const [allCameras] = useState([
    { id: 'Camera1', url: 'http://192.168.1.67:81/stream' }
  ]);



  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

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

  return (
    <div className="container mx-auto p-4">
      <button
        className="mb-4 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
        onClick={toggleNavbar}
      >
        Kamera Kontrolu {isNavbarOpen ? 'Kapat' : 'Aç'}
      </button>

      {isNavbarOpen && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
          <CameraController
            allCameras={allCameras}
            onSelectCamera={handleSelectCamera}
            openAllCameras={openAllCameras}
            closeAllCameras={closeAllCameras}
          />
        </div>
      )}

      <h2 className='text-2xl text-center mb-4'>Kamera Yönetim Sistemi</h2>

      <CameraGrid selectedCameras={selectedCameras} />
    </div>


  );
}

export default App;

//Navbar olmadan
{/* <div className="p-4">
<CameraController
  allCameras={allCameras}
  onSelectCamera={handleSelectCamera}
  openAllCameras={openAllCameras}
  closeAllCameras={closeAllCameras}
/>
<h2 className="text-2xl text-center mb-4">Kamera Yönetim Sistemi</h2>
<CameraGrid selectedCameras={selectedCameras} />
</div> */}