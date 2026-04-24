declare module 'qr-scanner' {
  declare class QrScanner {
    static WORKER_PATH: string;
    constructor(
      video: HTMLVideoElement,
      onDecode: (result: string | QrScanner.ScanResult) => void,
      options?: any,
    );
    start(): Promise<void>;
    stop(): Promise<void>;
    destroy(): void;
  }

  declare namespace QrScanner {
    interface ScanResult {
      data: string;
      [key: string]: any;
    }
  }

  export default QrScanner;
}
