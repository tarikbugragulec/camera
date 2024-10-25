import React, { useEffect } from 'react';

function Notification({ message, onClose }) {
    useEffect(() => {
        // 2 saniye sonra bildirimi kapat
        const timer = setTimeout(() => {
            onClose();
        }, 2000);

        // Temizleme işlemi
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg z-50">
            <span>{message}</span>
            <button
                onClick={onClose}
                className="ml-4 font-bold"
            >
                X
            </button>
        </div>
    );
}

export default Notification;
