
import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, RefreshCcw, Check, Sparkles, Scan, ArrowLeft } from 'lucide-react';
import { Screen } from '../types';
import TopBar from './TopBar';

interface CaptureScreenProps {
  onNavigate: (screen: Screen) => void;
  onCapture: (imageData: string) => void;
}

const CaptureScreen: React.FC<CaptureScreenProps> = ({ onNavigate, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }, 
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsReady(true);
      }
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please check permissions.");
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center overflow-hidden">
      <TopBar onNavigate={onNavigate} currentScreen="capture" />

      <div className="flex-1 w-full max-w-5xl px-6 py-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate('projects')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Back to Projects
          </button>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">Live IP Scan Active</span>
          </div>
        </div>

        <div className="flex-1 relative bg-black rounded-[3rem] overflow-hidden border-4 border-slate-800 shadow-2xl flex items-center justify-center">
          {error ? (
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <X size={32} />
              </div>
              <p className="text-white font-bold">{error}</p>
              <button 
                onClick={startCamera}
                className="mt-4 bg-white/10 text-white px-6 py-2 rounded-xl hover:bg-white/20 transition-all font-bold"
              >
                Retry
              </button>
            </div>
          ) : capturedImage ? (
            <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover opacity-80"
              />
              {/* Scan Overlay UI */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[80%] h-[70%] border-2 border-dashed border-indigo-400/50 rounded-2xl relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-lg" />
                  
                  {/* Moving scan line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-[scan_3s_ease-in-out_infinite]" />
                </div>
              </div>
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Controls */}
        <div className="flex justify-center gap-6 py-4">
          {!capturedImage ? (
            <button 
              onClick={takePhoto}
              disabled={!isReady}
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all group disabled:opacity-50"
            >
              <div className="w-16 h-16 rounded-full border-4 border-slate-900 flex items-center justify-center">
                 <Scan size={32} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
              </div>
            </button>
          ) : (
            <div className="flex gap-4">
              <button 
                onClick={handleRetake}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold transition-all"
              >
                <RefreshCcw size={20} /> Retake
              </button>
              <button 
                onClick={handleConfirm}
                className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all"
              >
                <Check size={20} /> Analyze Sketch
              </button>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <Sparkles size={12} className="text-indigo-500" />
            AI-Powered visual feature extraction enabled
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default CaptureScreen;
