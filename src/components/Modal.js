// src/components/Modal.js
import React from 'react';
import './Modal.css'; // Kita akan buat file CSS sederhana untuk modal

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}> {/* Klik overlay untuk menutup */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Mencegah close saat klik konten modal */}
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close-button" onClick={onClose}>
            × {/* Karakter 'x' untuk tombol close */}
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;