import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console or error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 flex items-center justify-center">
          <div className="max-w-2xl w-full text-center">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Oops! Terjadi Kesalahan</h2>
              <p className="text-xl text-slate-600 mb-8">
                Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu tentang masalah ini.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Muat Ulang Halaman
                </button>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="btn-outline"
                >
                  Kembali ke Dashboard
                </button>
              </div>

              {/* Error details for development */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-8 text-left">
                  <summary className="cursor-pointer text-slate-600 font-medium mb-4">
                    Detail Error (Development Only)
                  </summary>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm">
                    <h4 className="font-bold text-red-800 mb-2">Error:</h4>
                    <pre className="text-red-700 mb-4 overflow-auto">
                      {this.state.error.toString()}
                    </pre>
                    
                    <h4 className="font-bold text-red-800 mb-2">Stack Trace:</h4>
                    <pre className="text-red-700 overflow-auto text-xs">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

// Functional component wrapper for easier use
export const withErrorBoundary = (Component) => {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

// Simple error display component
export const ErrorMessage = ({ 
  error, 
  onRetry, 
  className = '' 
}) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-xl p-6 text-center ${className}`}>
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h3 className="text-lg font-bold text-red-800 mb-2">Terjadi Kesalahan</h3>
      <p className="text-red-600 mb-4">
        {error?.message || 'Terjadi kesalahan yang tidak terduga'}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-outline border-red-300 text-red-600 hover:bg-red-600 hover:text-white"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
};

export default ErrorBoundary;
