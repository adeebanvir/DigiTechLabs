
import * as React from 'react';
import { Home, AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
          <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 text-[#141414]">
              <AlertTriangle size={40} />
            </div>
            <h1 className="text-3xl font-black text-[#141414] mb-4 tracking-tighter">System Alert</h1>
            <p className="text-gray-500 mb-10 leading-relaxed font-medium">
              An unexpected error occurred in the ecosystem. Our protocols have been activated to protect your session.
            </p>
            {this.state.error && (
              <div className="bg-red-50/50 p-4 rounded-2xl mb-8 text-left border border-red-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-2">Error Log:</p>
                <code className="text-xs text-red-600 break-all leading-tight">
                  {this.state.error.message.includes('{') ? 'Secure Firestore Restriction' : this.state.error.message}
                </code>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center justify-center w-full py-4 bg-[#141414] text-white rounded-2xl font-bold hover:bg-[#00A650] transition-all shadow-xl shadow-black/10"
              >
                <RefreshCcw size={18} className="mr-2" />
                Reload Ecosystem
              </button>
              <a 
                href="/" 
                className="flex items-center justify-center w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
              >
                <Home size={18} className="mr-2" />
                Return Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

export default ErrorBoundary;
