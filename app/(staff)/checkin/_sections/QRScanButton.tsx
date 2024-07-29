'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QrCode, Camera, Upload } from 'lucide-react';
import QrScanner from 'qr-scanner';

type Step = 'select' | 'scan' | 'confirm';

const QRScanButton = () => {
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>('select');
  const [scanMethod, setScanMethod] = useState<'camera' | 'file' | null>(null);
  const [scanResult, setScanResult] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  const handleScan = (result: QrScanner.ScanResult) => {
    if (scannerRef.current) {
      scannerRef.current.stop();
    }
    setScanResult(result.data);
    setStep('confirm');
  };

  useEffect(() => {
    if (step === 'scan' && scanMethod === 'camera') {
      if (!videoRef.current) {
        setError('Camera initialization failed. Please try again.');
        return;
      }

      const startScanner = async () => {
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
          scannerRef.current = new QrScanner(
            videoRef.current!,
            handleScan,
            { returnDetailedScanResult: true, highlightCodeOutline: true, highlightScanRegion: true }
          );
          await scannerRef.current.start();
          setError(null); // Clear any previous errors
        } catch (error) {
          console.error('Error accessing camera:', error);
          setError('Failed to access camera. Please check your camera permissions and try again.');
          setStep('select');
          setScanMethod(null);
        }
      };
      startScanner();
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
    };
  }, [step, scanMethod]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
        handleScan(result);
      } catch (error) {
        alert('No QR code found in the image.');
      }
    }
  };

  const confirmScan = () => {
    console.log('Confirmed QR code:', scanResult);
    setIsOpen(false);
  };

  const retry = () => {
    setError(null);
    setScanResult('');
    setStep('select');
    setScanMethod(null);
  };

  const renderStepContent = () => {
    switch (step) {
      case 'select':
        return (
          <div className="space-y-4">
            <Button onClick={() => { setScanMethod('camera'); setStep('scan'); }} className="w-full">
              <Camera className="mr-2 h-4 w-4" /> Use Camera
            </Button>
            <Button onClick={() => { setScanMethod('file'); setStep('scan'); }} className="w-full">
              <Upload className="mr-2 h-4 w-4" /> Upload File
            </Button>
          </div>
        );
      case 'scan':
        if (error) {
          return (
            <div className="space-y-4">
              <p className="text-red-500">{error}</p>
              <Button onClick={retry}>Camera not detected! Please try again!</Button>
            </div>
          );
        }
        return (
          <div className="space-y-4">
            {scanMethod === 'camera' ? (
              <div className="aspect-video">
                <video ref={videoRef} className="w-full h-full" />
              </div>
            ) : (
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="w-full"
              />
            )}
          </div>
        );
      case 'confirm':
        return (
          <div className="space-y-4">
            <p className="font-bold">Scanned Result:</p>
            <p className="p-2 bg-gray-100 rounded break-all">{scanResult}</p>
            <div className="flex space-x-2">
              <Button onClick={confirmScan}>Confirm</Button>
              <Button variant="outline" onClick={retry}>Retry</Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        setStep('select');
        setScanMethod(null);
        setScanResult('');
        setError(null); // Clear any errors when closing the dialog
      }
    }}>

      <DialogTrigger asChild>
        <div className="aspect-square w-full">
          <Button
            variant="outline"
            className="w-full h-full flex flex-col items-center justify-center border rounded bg-white hover:bg-black hover:text-white transition-colors duration-300"
          >
            <QrCode className="h-8 w-8 mb-2" />
            <span className="text-xs uppercase font-bold">Scan QR</span>
          </Button>
        </div>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50" />
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 max-w-md w-full">
          <DialogTitle className="text-lg font-bold mb-4">Scan QR Code</DialogTitle>
          <DialogDescription className="text-muted-foreground mb-4">
            {step === 'select' && "Choose how you want to scan the QR code"}
            {step === 'scan' && (scanMethod === 'camera' ? "Position the QR code in front of the camera" : "Select an image file containing a QR code")}
            {step === 'confirm' && "Verify the scanned QR code"}
          </DialogDescription>
          {renderStepContent()}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default QRScanButton;