import React, { useState, useEffect } from 'react';
import {
  Mail,
  X,
  Send,
  FileEdit,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { googleSignIn, initAuth, logout, getAccessToken } from '../lib/firebaseAuth';
import { sendEmailViaGmail, createDraftViaGmail } from '../lib/gmailService';

interface GmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptTitle: string;
  promptContent: string;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const GmailModal: React.FC<GmailModalProps> = ({
  isOpen,
  onClose,
  promptTitle,
  promptContent,
  onShowToast,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Form Fields
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Confirmation state before action
  const [actionType, setActionType] = useState<'send' | 'draft' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSubject(`Prompt: ${promptTitle || 'Custom Prompt'}`);
      setEmailBody(
        `Hi,\n\nHere is the generated prompt from Prompt Builder:\n\n---\n${promptContent}\n---\n\nSent via Prompt Builder App`
      );
      setSuccessMessage(null);
      setErrorMessage(null);
      setActionType(null);

      // Check auth status
      const unsubscribe = initAuth(
        (authedUser, token) => {
          setUser(authedUser);
          setHasToken(!!token);
        },
        () => {
          setUser(null);
          setHasToken(false);
        }
      );

      return () => unsubscribe();
    }
  }, [isOpen, promptTitle, promptContent]);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setHasToken(true);
        onShowToast(`Signed in as ${res.user.email} for Gmail`, 'success');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sign in with Google');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setHasToken(false);
    onShowToast('Signed out of Gmail', 'info');
  };

  const handleInitiateAction = (type: 'send' | 'draft') => {
    setErrorMessage(null);
    if (!recipient.trim() && type === 'send') {
      setErrorMessage('Please enter a recipient email address.');
      return;
    }
    if (!subject.trim()) {
      setErrorMessage('Please enter an email subject.');
      return;
    }
    setActionType(type);
  };

  const handleConfirmAction = async () => {
    if (!actionType) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      if (actionType === 'send') {
        const res = await sendEmailViaGmail({
          to: recipient.trim(),
          subject: subject.trim(),
          body: emailBody,
        });

        if (res.success) {
          setSuccessMessage(`Email sent successfully via Gmail! (Message ID: ${res.id})`);
          onShowToast('Email sent via Gmail!', 'success');
          setTimeout(() => {
            onClose();
          }, 2000);
        } else {
          setErrorMessage(res.error || 'Failed to send email.');
        }
      } else if (actionType === 'draft') {
        const res = await createDraftViaGmail({
          to: recipient.trim(),
          subject: subject.trim(),
          body: emailBody,
        });

        if (res.success) {
          setSuccessMessage(`Draft created in your Gmail account! (Draft ID: ${res.id})`);
          onShowToast('Draft created in Gmail!', 'success');
          setTimeout(() => {
            onClose();
          }, 2000);
        } else {
          setErrorMessage(res.error || 'Failed to create draft.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error performing Gmail action.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-red-950/80 via-slate-900 to-rose-950/80 p-5 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/20">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                Gmail Integration
                <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/20 uppercase">
                  Google Workspace
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Send generated prompts or create drafts directly in your Gmail inbox
              </p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4">
          
          {/* Sign-In / Account Status */}
          {!user || !hasToken ? (
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-red-400">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Connect Google / Gmail</h4>
                <p className="text-xs text-slate-400 mt-0.5 max-w-xs mx-auto">
                  Sign in with Google to enable official Gmail API sending and draft creation.
                </p>
              </div>

              {errorMessage && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 bg-rose-950/50 p-2 rounded-lg border border-rose-900">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Standard Google Sign-In Button */}
              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="w-full flex items-center justify-center gap-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 py-3 px-4 text-xs font-bold shadow-md transition-all active:scale-98 disabled:opacity-50"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-slate-900" />
                    <span>Connecting Google Account...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Connected View & Form */
            <div className="space-y-4">
              
              {/* Account Pill */}
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="h-6 w-6 rounded-full" />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-[10px]">
                      {user.email?.charAt(0).toUpperCase() || 'G'}
                    </div>
                  )}
                  <span className="truncate text-slate-200 font-semibold">{user.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-rose-400 transition-colors shrink-0"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>

              {/* Confirmation Box (Mandatory per workspace integration rules) */}
              {actionType ? (
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-3">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Confirm Gmail Action</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {actionType === 'send'
                      ? `Are you sure you want to send this email via your Gmail account (${user.email}) to "${recipient}"?`
                      : `Are you sure you want to create a new draft in your Gmail account (${user.email})?`}
                  </p>

                  {errorMessage && (
                    <p className="text-xs font-semibold text-rose-400">{errorMessage}</p>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setActionType(null)}
                      disabled={isProcessing}
                      className="flex-1 rounded-lg border border-slate-700 bg-slate-800 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmAction}
                      disabled={isProcessing}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 py-2 text-xs font-bold text-white shadow-md transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Executing...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-3.5 w-3.5" />
                          <span>Confirm {actionType === 'send' ? 'Send' : 'Save Draft'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : successMessage ? (
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Gmail Action Complete!</h4>
                  <p className="text-xs text-emerald-300">{successMessage}</p>
                </div>
              ) : (
                /* Form Fields */
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      To (Recipient Email)
                    </label>
                    <input
                      type="email"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="colleague@example.com"
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-red-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Prompt details..."
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-red-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Email Body Preview
                    </label>
                    <textarea
                      rows={6}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="w-full resize-none rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:border-red-500 focus:outline-hidden leading-relaxed"
                    />
                  </div>

                  {errorMessage && (
                    <p className="text-xs font-semibold text-rose-400">{errorMessage}</p>
                  )}

                  {/* Actions Bar */}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleInitiateAction('draft')}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 py-2.5 text-xs font-semibold text-slate-200 transition-colors"
                    >
                      <FileEdit className="h-3.5 w-3.5 text-amber-400" />
                      <span>Save as Gmail Draft</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInitiateAction('send')}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-90 py-2.5 text-xs font-bold text-white shadow-md shadow-red-500/20 transition-all active:scale-98"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Send via Gmail</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
