import { Navigate } from "react-router-dom";
import { canAccessFeature, getUserRole, getRoleDisplayName } from "../utils/roleUtils";

const RoleGuard = ({ children, requiredFeature, fallbackPath = "/dashboard" }) => {
  const userRole = getUserRole();
  const hasAccess = canAccessFeature(requiredFeature);

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Akses Ditolak</h2>
          <p className="text-gray-600 mb-6">
            Maaf, sebagai <span className="font-semibold text-blue-600">{getRoleDisplayName(userRole)}</span> Anda tidak memiliki akses ke halaman ini.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-yellow-800 text-sm">
                Hubungi administrator jika Anda merasa ini adalah kesalahan.
              </span>
            </div>
          </div>
          <button
            onClick={() => window.location.href = fallbackPath}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleGuard;
