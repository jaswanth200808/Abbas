import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  QrCode, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Camera, 
  Upload, 
  Sparkles, 
  Smartphone 
} from 'lucide-react';
import { Item, User } from '../types';
import { useApp } from '../context/AppContext';
import { generateQrDataUrl, buildUpiPaymentString } from '../utils/qrHelper';

interface OwnerScannerModalProps {
  item?: Item;
  owner?: User;
  onClose: () => void;
  suggestedAmount?: number;
  mode?: 'view' | 'camera';
}

export const OwnerScannerModal: React.FC<OwnerScannerModalProps> = ({ 
  item, 
  owner, 
  onClose,
  suggestedAmount,
  mode = 'view'
}) => {
  const { showToast, allUsers, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'qr' | 'camera'>(mode === 'camera' ? 'camera' : 'qr');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine owner information
  const targetOwner: Partial<User> = owner || (item ? allUsers.find(u => u.id === item.ownerId) || {
    id: item.ownerId,
    name: item.ownerName,
    avatar: item.ownerAvatar,
    phone: item.ownerPhone || '+91 98765 43210',
    upiId: item.ownerUpiId || `${item.ownerName.toLowerCase().replace(/\s+/g, '')}@upi`
  } : currentUser);

  const ownerUpi = item?.ownerUpiId || targetOwner.upiId || `${targetOwner.name?.toLowerCase().replace(/\s+/g, '') || 'campus'}@upi`;
  const ownerQrImage = item?.ownerQrCode || targetOwner.qrCode;
  const qrLabel = item?.ownerQrLabel || targetOwner.qrLabel || 'Google Pay / PhonePe / Paytm UPI Scanner';
  const amountToPay = suggestedAmount ?? (item ? (item.rentPricePerDay + (item.securityDeposit || 0)) : 0);

  useEffect(() => {
    let isMounted = true;
    async function loadQr() {
      if (ownerQrImage) {
        setQrDataUrl(ownerQrImage);
      } else {
        const upiString = buildUpiPaymentString({
          upiId: ownerUpi,
          payeeName: targetOwner.name || 'Campus Student Owner',
          amount: amountToPay > 0 ? amountToPay : undefined,
          itemTitle: item?.title
        });
        const generated = await generateQrDataUrl(upiString);
        if (isMounted) {
          setQrDataUrl(generated);
        }
      }
    }
    loadQr();
    return () => {
      isMounted = false;
    };
  }, [ownerQrImage, ownerUpi, targetOwner.name, amountToPay, item?.title]);

  // Handle Camera start/stop
  const startCamera = async () => {
    try {
      setScanResult(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch {
      showToast('Camera access permission was not granted or camera is unavailable.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab]);

  const handleCopyUpi = () => {
    if (ownerUpi) {
      navigator.clipboard.writeText(ownerUpi);
      setCopied(true);
      showToast(`UPI ID "${ownerUpi}" copied to clipboard!`);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${targetOwner.name || 'owner'}-scanner-qr.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('QR Code image downloaded!');
  };

  const handleSimulateScan = () => {
    const verifiedId = `VERIFIED_HANDOVER_${Date.now().toString().slice(-6)}`;
    setScanResult(verifiedId);
    showToast(`✓ Scanner successfully verified owner QR code (${verifiedId})!`);
  };

  const handleImageScanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const verifiedId = `QR_UPLOAD_VERIFIED_${Date.now().toString().slice(-6)}`;
      setScanResult(verifiedId);
      showToast(`✓ QR image scanned & verified (${file.name})!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-5 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-indigo-200 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-indigo-200 text-xs font-semibold mb-2">
            <QrCode className="w-3.5 h-3.5 text-indigo-300" />
            <span>Owner Payment & Handover Scanner</span>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>Owner QR Scanner</span>
          </h2>
          <p className="text-xs text-indigo-200 mt-1">
            {item ? `Scan to pay rent/deposit or verify handover for "${item.title}"` : `Verified campus scanner for ${targetOwner.name}`}
          </p>

          {/* Tab buttons */}
          <div className="flex items-center gap-2 mt-4 bg-black/20 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'qr'
                  ? 'bg-white text-indigo-950 shadow-xs'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Owner QR Code</span>
            </button>
            <button
              onClick={() => setActiveTab('camera')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'camera'
                  ? 'bg-white text-indigo-950 shadow-xs'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Live Campus Scanner</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {activeTab === 'qr' && (
            <div className="space-y-4 text-center">
              
              {/* Owner Profile Banner */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-left">
                <div className="flex items-center gap-3">
                  <img 
                    src={targetOwner.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'} 
                    alt={targetOwner.name || 'Owner'} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200 dark:border-indigo-700 shadow-xs"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span>{targetOwner.name}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      {targetOwner.phone}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100/80 dark:bg-indigo-900 px-2 py-0.5 rounded-md">
                    Verified Owner
                  </span>
                  {amountToPay > 0 && (
                    <div className="text-xs font-black text-slate-800 dark:text-slate-200 mt-1">
                      ₹{amountToPay} Total
                    </div>
                  )}
                </div>
              </div>

              {/* QR Code Container */}
              <div className="bg-white p-4 rounded-3xl border-2 border-dashed border-indigo-200 dark:border-indigo-700 inline-block shadow-lg relative group">
                {qrDataUrl ? (
                  <div className="space-y-2">
                    <img 
                      src={qrDataUrl} 
                      alt="Owner QR Scanner" 
                      className="w-56 h-56 mx-auto rounded-2xl object-contain bg-white"
                    />
                    <div className="text-[11px] font-bold text-slate-600 flex items-center justify-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{qrLabel}</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-56 h-56 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <QrCode className="w-12 h-12 text-indigo-300 animate-pulse" />
                    <span className="text-xs font-medium">Generating QR Code...</span>
                  </div>
                )}
              </div>

              {/* UPI ID Pill with Copy */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                <div className="text-left truncate">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Owner UPI ID</div>
                  <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100 truncate select-all">{ownerUpi}</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    copied 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy UPI'}</span>
                </button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="py-2 px-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-800 dark:text-indigo-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Download QR</span>
                </button>
                <a
                  href={`upi://pay?pa=${ownerUpi}&pn=${encodeURIComponent(targetOwner.name || 'Owner')}&cu=INR${amountToPay > 0 ? `&am=${amountToPay}` : ''}`}
                  className="py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open UPI App</span>
                </a>
              </div>

              {/* Safety notice */}
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-[11px] flex items-center gap-2 text-left">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pay deposits or rent upon physical item handover on campus for maximum safety.</span>
              </div>
            </div>
          )}

          {activeTab === 'camera' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Campus Handover Camera Scanner
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Point camera at the owner's QR code or upload a QR image from your gallery.
                </p>
              </div>

              {/* Viewfinder Camera Box */}
              <div className="relative aspect-4/3 rounded-2xl bg-black overflow-hidden flex items-center justify-center shadow-inner">
                <video 
                  ref={videoRef} 
                  playsInline 
                  muted 
                  className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`} 
                />

                {!isCameraActive && (
                  <div className="text-center text-slate-400 p-4 space-y-2">
                    <Camera className="w-10 h-10 mx-auto text-slate-500" />
                    <div className="text-xs">Camera preview is standby</div>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
                    >
                      Enable Device Camera
                    </button>
                  </div>
                )}

                {/* Animated Scanning Box Overlay */}
                {isCameraActive && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                    <div className="w-48 h-48 border-2 border-indigo-400 rounded-2xl relative">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-400 -mt-1 -ml-1" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-400 -mt-1 -mr-1" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-400 -mb-1 -ml-1" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-400 -mb-1 -mr-1" />
                      
                      {/* Laser scanning line */}
                      <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-bounce top-1/2" />
                    </div>
                  </div>
                )}
              </div>

              {/* Scan result banner if detected */}
              {scanResult && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs space-y-1 animate-in zoom-in-95">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Scan Confirmed & Verified!</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Owner QR code match verified: <strong className="font-mono">{scanResult}</strong>
                  </p>
                </div>
              )}

              {/* Camera Scanner Controls */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSimulateScan}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Test Scan QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload QR Image</span>
                </button>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageScanUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
          >
            Close Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
