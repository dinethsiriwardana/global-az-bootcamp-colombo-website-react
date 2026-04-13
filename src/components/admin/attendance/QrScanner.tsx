import React, { useCallback, useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from "html5-qrcode";

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
  const scannerElementIdRef = useRef(
    `attendance-scanner-${Math.random().toString(36).slice(2, 11)}`,
  );
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isStartingRef = useRef(false);

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner) {
      return;
    }

    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
    } catch {
      // Ignore stop errors because scanner state can race while tearing down.
    }

    try {
      await scanner.clear();
    } catch {
      // Ignore clear errors when scanner container is already removed.
    }

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

    const scanner = new Html5Qrcode(scannerElementIdRef.current, {
      verbose: false,
    });

    const scannerConfig: Html5QrcodeCameraScanConfig = {
      fps: 10,
      qrbox: { width: 260, height: 260 },
      aspectRatio: 16 / 9,
    };

    scannerRef.current = scanner;
    isStartingRef.current = true;

    void scanner
      .start(
        { facingMode: "environment" },
        scannerConfig,
        (decodedText) => {
          onDetected(decodedText);
        },
        () => {
          // Ignore per-frame decode errors while camera keeps scanning.
        },
      )
      .then(() => {
        onScannerError("");
        onScannerStarted?.();
      })
      .catch(async (error) => {
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
      <div id={scannerElementIdRef.current} className="attendance-scanner-preview" />
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
