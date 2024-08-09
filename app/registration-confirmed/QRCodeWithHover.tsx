import React from 'react';

interface QRCodeWithHoverProps {
  qrCode: string;
  onSave: () => void;
}

const QRCodeWithHover: React.FC<QRCodeWithHoverProps> = ({ qrCode, onSave }) => {
  return (
    <div className="relative group">
      <img src={qrCode} alt="Registration QR Code" className="w-48 h-48" />
      <div 
        className="absolute inset-0 bg-primary/80 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        onClick={onSave}
      >
        <span className="text-white font-semibold">Save QR Code</span>
      </div>
    </div>
  );
};

export default QRCodeWithHover;