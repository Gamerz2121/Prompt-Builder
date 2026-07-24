import React, { useState } from 'react';
import {
  Crown,
  X,
  Lock,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  QrCode,
  Zap,
  Sparkles,
  Check,
  Globe,
  Loader2,
} from 'lucide-react';
import { Tier } from '../types';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: Tier;
  onActivatePro: () => { success: boolean; message: string };
  onResetTier?: () => void;
}

type PaymentMethod = 'card' | 'apple_pay' | 'paypal' | 'upi';
type UpiApp = 'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'amazonpay';

// Branded Logo Components
const VisaIcon = () => (
  <svg className="h-3.5 w-8" viewBox="0 0 36 12" fill="none">
    <path d="M13.882 0.354L9.08 11.638H6.012L3.642 2.502C3.5 1.954 3.23 1.762 2.768 1.512C2.016 1.106 0.942 0.74 0 0.528L0.1 0.354H5.068C5.72 0.354 6.294 0.788 6.442 1.488L7.694 8.148L10.738 0.354H13.882ZM25.32 8.358C25.334 5.626 21.558 5.474 21.584 3.906C21.594 3.428 22.052 2.916 23.052 2.784C23.55 2.718 24.912 2.662 26.35 3.324L26.942 0.584C26.136 0.288 25.108 0 23.828 0C20.892 0 18.818 1.56 18.8 3.792C18.776 5.444 20.276 6.368 21.4 6.918C22.556 7.482 22.946 7.838 22.936 8.344C22.922 9.122 21.988 9.462 21.122 9.476C19.642 9.5 18.784 9.076 18.102 8.76L17.488 11.614C18.28 11.982 19.742 12.296 21.25 12.316C24.364 12.316 26.376 10.776 26.32 8.358ZM33.87 11.638H36.6L34.218 0.354H31.764C31.218 0.354 30.764 0.672 30.56 1.16L26.118 11.638H29.31L29.948 9.878H33.832L33.87 11.638ZM30.82 7.472L32.4 3.164L33.308 7.472H30.82ZM18.256 0.354L15.752 11.638H12.724L15.228 0.354H18.256Z" fill="#3B82F6"/>
  </svg>
);

const MastercardIcon = () => (
  <svg className="h-4 w-6" viewBox="0 0 24 15" fill="none">
    <circle cx="7" cy="7.5" r="7" fill="#EB001B"/>
    <circle cx="17" cy="7.5" r="7" fill="#F79E1B"/>
    <path d="M12 2.22A6.97 6.97 0 0 0 9.5 7.5c0 2.1.92 4 2.5 5.28A6.97 6.97 0 0 0 14.5 7.5c0-2.1-.92-4-2.5-5.28z" fill="#FF5F00"/>
  </svg>
);

const AmexBadge = () => (
  <span className="text-[9px] font-black tracking-tighter text-sky-300 bg-sky-950 px-1 py-0.5 rounded border border-sky-800">
    AMEX
  </span>
);

const RuPayBadge = () => (
  <span className="text-[9px] font-black tracking-tighter text-emerald-300 bg-emerald-950 px-1 py-0.5 rounded border border-emerald-800">
    RuPay
  </span>
);

const ApplePayBrand = ({ className = "h-5" }: { className?: string }) => (
  <div className={`inline-flex items-center gap-0.5 font-bold tracking-tight text-white ${className}`}>
    <span className="text-base leading-none"></span>
    <span className="text-xs font-black tracking-tight">Pay</span>
  </div>
);

const PayPalBrand = ({ className = "h-5" }: { className?: string }) => (
  <div className={`inline-flex items-center gap-1 font-black italic tracking-tighter ${className}`}>
    <svg className="h-4 w-4" viewBox="0 0 100 100" fill="none">
      <path d="M35 15H65C78 15 88 23 85 37C82 50 71 58 57 58H45L39 88H22L35 15Z" fill="#003087"/>
      <path d="M45 30H72C83 30 91 37 88 49C85 61 74 69 61 69H50L45 92H31L45 30Z" fill="#0079C1" opacity="0.9"/>
    </svg>
    <span className="text-xs font-black text-blue-400">Pay<span className="text-sky-400">Pal</span></span>
  </div>
);

const UpiBrand = ({ className = "h-5" }: { className?: string }) => (
  <div className={`inline-flex items-center gap-1.5 ${className}`}>
    <div className="flex h-4 w-6 items-center justify-center rounded bg-gradient-to-r from-orange-500 via-white to-emerald-500 p-[1px] shadow-xs">
      <div className="flex h-full w-full items-center justify-center rounded-[3px] bg-slate-950 text-[8px] font-black text-white">
        UPI
      </div>
    </div>
    <span className="text-xs font-bold text-slate-100">UPI</span>
  </div>
);

export const ProModal: React.FC<ProModalProps> = ({
  isOpen,
  onClose,
  tier,
  onActivatePro,
  onResetTier,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');

  // Debit/Credit Card State
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // PayPal State
  const [paypalEmail, setPaypalEmail] = useState('');

  // UPI State
  const [selectedUpiApp, setSelectedUpiApp] = useState<UpiApp>('gpay');
  const [upiId, setUpiId] = useState('');
  const [upiMode, setUpiMode] = useState<'app' | 'vpa' | 'qr'>('app');

  // Checkout Status
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleCompletePayment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    // Validation per method
    if (selectedMethod === 'card') {
      if (!cardName.trim() || !cardNumber.trim()) {
        setErrorMessage('Please fill in your card details.');
        return;
      }
    } else if (selectedMethod === 'paypal') {
      if (!paypalEmail.trim() || !paypalEmail.includes('@')) {
        setErrorMessage('Please enter a valid PayPal email address.');
        return;
      }
    } else if (selectedMethod === 'upi' && upiMode === 'vpa') {
      if (!upiId.trim() || !upiId.includes('@')) {
        setErrorMessage('Please enter a valid UPI ID (e.g. name@upi).');
        return;
      }
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      onActivatePro();

      setTimeout(() => {
        onClose();
        setPaymentSuccess(false);
        setIsProcessing(false);
        setErrorMessage('');
      }, 2200);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto text-slate-100">
        
        {/* Header / Banner */}
        <div className="relative bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 p-5 sm:p-6 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              <Crown className="h-6 w-6 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Unlock Prompt Builder Pro
                </h2>
                <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                  Lifetime Access
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                One-time payment of <span className="font-bold text-emerald-400">$9.00 USD</span> (₹749 INR) — No recurring fees
              </p>
            </div>
          </div>

          {/* Quick Feature Pills */}
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-300">
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-950/60 px-2.5 py-1 border border-slate-800">
              <Sparkles className="h-3 w-3 text-amber-400" /> Unlimited Prompt Generations
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-950/60 px-2.5 py-1 border border-slate-800">
              <Check className="h-3 w-3 text-indigo-400" /> All 8 Task Categories
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-950/60 px-2.5 py-1 border border-slate-800">
              <Zap className="h-3 w-3 text-emerald-400" /> 6 Advanced Frameworks
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {paymentSuccess ? (
            /* Success State */
            <div className="py-10 text-center space-y-4 animate-fade-in">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white">Payment Received!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Your Pro License is now active. All 8 task categories and expert frameworks are unlocked forever.
                </p>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-950/80 px-3.5 py-1.5 text-xs font-bold text-emerald-300 border border-emerald-800">
                  <ShieldCheck className="h-4 w-4" /> Lifetime Pro Active
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* Payment Method Selector Grid */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  
                  {/* 1. Card Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethod('card');
                      setErrorMessage('');
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      selectedMethod === 'card'
                        ? 'border-indigo-500 bg-indigo-500/15 text-white font-bold shadow-md shadow-indigo-500/10'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-1.5">
                      <CreditCard className="h-4 w-4 text-indigo-400" />
                    </div>
                    <span className="text-xs font-bold">Debit / Card</span>
                    <div className="flex items-center gap-1 mt-1 opacity-80">
                      <VisaIcon />
                      <MastercardIcon />
                    </div>
                  </button>

                  {/* 2. Apple Pay Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethod('apple_pay');
                      setErrorMessage('');
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      selectedMethod === 'apple_pay'
                        ? 'border-indigo-500 bg-indigo-500/15 text-white font-bold shadow-md shadow-indigo-500/10'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <ApplePayBrand className="mb-1" />
                    <span className="text-[10px] text-slate-400 font-medium">Instant Touch/Face ID</span>
                  </button>

                  {/* 3. PayPal Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethod('paypal');
                      setErrorMessage('');
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      selectedMethod === 'paypal'
                        ? 'border-indigo-500 bg-indigo-500/15 text-white font-bold shadow-md shadow-indigo-500/10'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <PayPalBrand className="mb-1" />
                    <span className="text-[10px] text-slate-400 font-medium">Global Express</span>
                  </button>

                  {/* 4. UPI Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethod('upi');
                      setErrorMessage('');
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      selectedMethod === 'upi'
                        ? 'border-indigo-500 bg-indigo-500/15 text-white font-bold shadow-md shadow-indigo-500/10'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <UpiBrand className="mb-1" />
                    <span className="text-[10px] text-slate-400 font-medium">GPay, PhonePe, QR</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Payment Method View */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5 space-y-4">
                
                {/* 1. Debit / Credit Card Form */}
                {selectedMethod === 'card' && (
                  <form onSubmit={handleCompletePayment} className="space-y-3.5">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <CreditCard className="h-4 w-4 text-indigo-400" /> Credit / Debit Card
                      </span>
                      <div className="flex items-center gap-1.5">
                        <VisaIcon />
                        <MastercardIcon />
                        <AmexBadge />
                        <RuPayBadge />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 •••• •••• 8892"
                        className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="08/28"
                          className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          CVV / CVC
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          required
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="123"
                          className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {errorMessage && (
                      <p className="text-xs font-semibold text-rose-400">{errorMessage}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-xs font-bold text-white hover:opacity-90 active:scale-98 transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Processing Card Payment...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-3.5 w-3.5" />
                          <span>Pay $9.00 USD securely</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* 2. Apple Pay View */}
                {selectedMethod === 'apple_pay' && (
                  <div className="space-y-4 py-2 text-center">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 space-y-2">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-white border border-slate-800 shadow-md">
                        <span className="text-2xl leading-none"></span>
                      </div>
                      <h4 className="text-sm font-bold text-white flex items-center justify-center gap-1">
                        <span>Apple Pay</span> Quick Checkout
                      </h4>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        Pay instantly using Touch ID, Face ID, or passcode on your Apple device.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCompletePayment()}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 py-3.5 text-sm font-bold shadow-lg transition-all active:scale-98 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                          <span>Confirming on Device...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-xl leading-none"></span>
                          <span>Pay with Apple Pay ($9.00)</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* 3. PayPal View */}
                {selectedMethod === 'paypal' && (
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2">
                        <PayPalBrand />
                        <span className="text-xs font-bold text-slate-300">Express Checkout</span>
                      </div>
                      <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                        Pay in 4 available
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        PayPal Email Address
                      </label>
                      <input
                        type="email"
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        placeholder="yourname@domain.com"
                        className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-hidden"
                      />
                    </div>

                    {errorMessage && (
                      <p className="text-xs font-semibold text-rose-400">{errorMessage}</p>
                    )}

                    <button
                      type="button"
                      onClick={() => handleCompletePayment()}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 py-3 text-xs font-black shadow-md transition-all active:scale-98 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                          <span>Connecting to PayPal...</span>
                        </>
                      ) : (
                        <>
                          <PayPalBrand />
                          <span className="ml-1 text-slate-950">Checkout ($9.00 USD)</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* 4. UPI View */}
                {selectedMethod === 'upi' && (
                  <div className="space-y-4">
                    {/* UPI Submode Toggles */}
                    <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setUpiMode('app')}
                        className={`flex-1 py-1.5 rounded-md transition-all ${
                          upiMode === 'app'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        UPI App
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpiMode('vpa')}
                        className={`flex-1 py-1.5 rounded-md transition-all ${
                          upiMode === 'vpa'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        UPI ID / VPA
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpiMode('qr')}
                        className={`flex-1 py-1.5 rounded-md transition-all ${
                          upiMode === 'qr'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Scan QR Code
                      </button>
                    </div>

                    {/* App Selection Grid */}
                    {upiMode === 'app' && (
                      <div className="space-y-3">
                        <label className="block text-[11px] font-semibold text-slate-400">
                          Choose UPI Application
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {[
                            {
                              id: 'gpay',
                              name: 'Google Pay',
                              badge: 'GPay',
                              color: 'border-blue-500/40 bg-blue-500/10 text-blue-300',
                            },
                            {
                              id: 'phonepe',
                              name: 'PhonePe',
                              badge: 'pe',
                              color: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
                            },
                            {
                              id: 'paytm',
                              name: 'Paytm UPI',
                              badge: 'Paytm',
                              color: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
                            },
                            {
                              id: 'bhim',
                              name: 'BHIM UPI',
                              badge: 'BHIM',
                              color: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
                            },
                            {
                              id: 'amazonpay',
                              name: 'Amazon Pay',
                              badge: 'amazon',
                              color: 'border-orange-500/40 bg-orange-500/10 text-orange-300',
                            },
                          ].map((app) => (
                            <button
                              key={app.id}
                              type="button"
                              onClick={() => setSelectedUpiApp(app.id as UpiApp)}
                              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                                selectedUpiApp === app.id
                                  ? `${app.color} border-2 shadow-sm`
                                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <span>{app.name}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 font-mono font-bold text-slate-200">
                                {app.badge}
                              </span>
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCompletePayment()}
                          disabled={isProcessing}
                          className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-3 text-xs font-bold shadow-md transition-all active:scale-98 disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Opening {selectedUpiApp.toUpperCase()} App...</span>
                            </>
                          ) : (
                            <>
                              <Smartphone className="h-4 w-4" />
                              <span>Pay ₹749 via {selectedUpiApp.toUpperCase()}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* VPA ID Input */}
                    {upiMode === 'vpa' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Enter UPI ID / VPA
                          </label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="username@okaxis / mobile@ybl"
                            className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-hidden"
                          />
                        </div>

                        {errorMessage && (
                          <p className="text-xs font-semibold text-rose-400">{errorMessage}</p>
                        )}

                        <button
                          type="button"
                          onClick={() => handleCompletePayment()}
                          disabled={isProcessing}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white py-3 text-xs font-bold shadow-md transition-all active:scale-98 disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Requesting UPI Payment...</span>
                            </>
                          ) : (
                            <>
                              <Zap className="h-4 w-4" />
                              <span>Verify & Pay ₹749</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* QR Code Scan */}
                    {upiMode === 'qr' && (
                      <div className="text-center py-2 space-y-3">
                        <div className="inline-block p-3 rounded-2xl bg-white shadow-xl">
                          {/* Simulated UPI QR Code SVG */}
                          <div className="h-36 w-36 bg-slate-950 p-2 rounded-xl flex flex-col items-center justify-center text-white relative overflow-hidden">
                            <QrCode className="h-28 w-28 text-white" />
                            <span className="text-[9px] font-bold text-emerald-400 absolute bottom-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                              UPI AUTO-SCAN
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300">
                          Scan using GPay, PhonePe, Paytm, or BHIM to pay <span className="font-bold text-emerald-400">₹749 INR</span>
                        </p>

                        <button
                          type="button"
                          onClick={() => handleCompletePayment()}
                          disabled={isProcessing}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 text-xs font-bold shadow-md transition-all active:scale-98 disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Verifying Payment Scan...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              <span>I've Scanned & Paid</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SSL Encryption & Guarantee footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/80">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> 256-Bit SSL Encrypted
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5 text-indigo-400" /> Instant Automatic Unlock
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

