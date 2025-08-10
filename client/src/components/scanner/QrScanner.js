import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QrScanner = ({ onScanSuccess, onScanFailure }) => {
  const html5QrCodeRef = useRef(null);
  const readerRef = useRef(null);

  useEffect(() => {
    if (readerRef.current && !html5QrCodeRef.current) {
      const html5QrCode = new Html5Qrcode(readerRef.current.id);
      html5QrCodeRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
      };

      html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText, decodedResult) => {
          if (onScanSuccess) {
            onScanSuccess(decodedText, decodedResult);
          }
        },
        (errorMessage) => {
          const isCommonScanError =
            /NotFoundException/.test(errorMessage) ||
            /No barcode or QR code detected/.test(errorMessage) ||
            /No MultiFormat Readers/.test(errorMessage);

          if (errorMessage && !isCommonScanError) {
            if (onScanFailure) {
              onScanFailure(errorMessage);
            }
          }
        }
      ).catch(err => {
        if (onScanFailure) {
          onScanFailure(err);
        }
      });
    }

    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(err => {
          console.error("Failed to stop the QR scanner.", err);
        });
      }
    };
  }, [onScanSuccess, onScanFailure]);

  return <div id="qr-reader-container" ref={readerRef} style={{ width: '100%' }}></div>;
};

export default QrScanner;