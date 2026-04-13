import React, { useCallback, useEffect, useRef } from "react";
import QrScannerLib from "qr-scanner";

interface QrScannerProps {
  isRunning: boolean;
  onDetected: (rawValue: string) => void;
  onPermissionDenied: (message: string) => void;
  onScannerError: (message: string) => void;
  onScannerStarted?: () => void;
}

const CAMERA_PERMISSION_ERROR_PATTERN = /(notallowederror|permission|denied)/i;
const CAMERA_NOT_FOUND_PATTERN = /(notfounderror|devices? not found|no camera|camera not found)/i;

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return String(error || "Unknown scanner error");
};

const QrScanner = ({
  isRunning,
  onDetected,
  onPermissionDenied,
  onScannerError,
  onScannerStarted,
}: QrScannerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<QrScannerLib | null>(null);
  const isStartingRef = useRef(false);

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner) {
      return;
    }

    try {
      await Promise.resolve(scanner.stop());
    } catch {
      // Ignore stop errors because scanner state can race while tearing down.
    }

    scanner.destroy();

    scannerRef.current = null;
    isStartingRef.current = false;
  }, []);

  useEffect(() => {
    return () => {
      void stopScanner();
    };
  }, [stopScanner]);

  useEffect(() => {
    if (!isRunning) {
      void stopScanner();
      return;
    }

    if (scannerRef.current || isStartingRef.current) {
      return;
    }

    const videoElement = videoRef.current;
    if (!videoElement) {
      return;
    }

    const scanner = new QrScannerLib(
      videoElement,
      (scanResult: string | QrScannerLib.ScanResult) => {
        const decodedText = typeof scanResult === "string" ? scanResult : scanResult.data;
        onDetected(decodedText);
      },
      {
        preferredCamera: "environment",
        returnDetailedScanResult: true,
        maxScansPerSecond: 10,
        highlightScanRegion: false,
        highlightCodeOutline: false,
      },
    );

    scannerRef.current = scanner;
    isStartingRef.current = true;

    void scanner
      .start()
      .then(() => {
        onScannerError("");
        onScannerStarted?.();
      })
      .catch(async (error: unknown) => {
        const message = getErrorMessage(error);

        if (CAMERA_PERMISSION_ERROR_PATTERN.test(message)) {
          onPermissionDenied("Camera access is required to scan QR codes");
        } else if (CAMERA_NOT_FOUND_PATTERN.test(message)) {
          onScannerError("No camera detected. Connect a camera and try again.");
        } else {
          onScannerError(`Unable to start scanner: ${message}`);
        }

        await stopScanner();
      })
      .finally(() => {
        isStartingRef.current = false;
      });
  }, [
    isRunning,
    onDetected,
    onPermissionDenied,
    onScannerError,
    onScannerStarted,
    stopScanner,
  ]);

  return (
    <div className="attendance-scanner-preview-wrap">
      <video ref={videoRef} className="attendance-scanner-preview" muted playsInline />
      <div
        className={`attendance-scanner-overlay ${
          isRunning ? "attendance-scanner-overlay-live" : ""
        }`}
      >
        {isRunning
          ? "Scanner live. Align attendee QR code inside the frame."
          : "Scanner inactive."}
      </div>
    </div>
  );
};

export default QrScanner;
