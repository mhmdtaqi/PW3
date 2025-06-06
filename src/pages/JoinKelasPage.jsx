import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Use the same BASE_URL logic as other components
const BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "/api" : "https://brainquiz0.up.railway.app");

const JoinKelasPage = () => {
  const [availableClasses, setAvailableClasses] = useState([]);
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showJoinedOnly, setShowJoinedOnly] = useState(false);
  const navigate = useNavigate();

  // Get user info from localStorage and token
  const getUserInfo = () => {
    // First try localStorage (most reliable)
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');

    if (storedUserId) {
      return {
        userId: storedUserId,
        userName: storedUserName || 'User'
      };
    }

    // Fallback to token decoding
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload); // Debug log
        // JWT uses 'Issuer' field for user ID in this backend
        return {
          userId: payload.iss || payload.user_id || payload.id || payload.sub,
          userName: payload.name || storedUserName || 'User'
        };
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    return {
      userId: null,
      userName: storedUserName || 'User'
    };
  };

  const { userId, userName } = getUserInfo();

  useEffect(() => {
    fetchClasses();
    fetchJoinedClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/kelas/get-kelas`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableClasses(data.data || []);
      } else {
        console.error('Failed to fetch classes');
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchJoinedClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/kelas/get-kelas-by-user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setJoinedClasses(data.data || []);
      } else {
        console.error('Failed to fetch joined classes');
      }
    } catch (error) {
      console.error('Error fetching joined classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async (kelasId) => {
    // Validasi user ID
    if (!userId) {
      alert('User ID tidak ditemukan. Silakan login ulang.');
      return;
    }

    setJoinLoading(kelasId);
    try {
      const token = localStorage.getItem('token');
      const requestData = {
        user_id: parseInt(userId),
        kelas_id: parseInt(kelasId),
      };

      console.log('Sending join request:', requestData); // Debug log

      const response = await fetch(`${BASE_URL}/kelas/join-kelas`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      console.log('Join response:', data); // Debug log

      if (response.ok) {
        // Refresh joined classes
        await fetchJoinedClasses();
        alert('Berhasil bergabung dengan kelas!');
      } else {
        console.error('Join failed:', data);
        alert(data.message || 'Gagal bergabung dengan kelas');
      }
    } catch (error) {
      console.error('Error joining class:', error);
      alert('Terjadi kesalahan saat bergabung dengan kelas');
    } finally {
      setJoinLoading(null);
    }
  };

  const isClassJoined = (kelasId) => {
    return joinedClasses.some(joinedClass => joinedClass.ID === kelasId);
  };

  const filteredClasses = availableClasses.filter(kelas => {
    const matchesSearch = kelas.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kelas.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (showJoinedOnly) {
      return matchesSearch && isClassJoined(kelas.ID);
    }
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Memuat data kelas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Join Kelas 🎓
        </h1>
        <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-3xl">
          Bergabunglah dengan kelas pembelajaran yang menarik dan tingkatkan pengetahuan Anda bersama teman-teman lainnya.
        </p>
        {/* Debug Info - Remove in production */}
        {userId && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
            <strong>Debug Info:</strong> User ID: {userId}, User: {userName}
          </div>
        )}
        {!userId && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg text-sm text-red-700">
            <strong>Warning:</strong> User ID tidak ditemukan. Silakan login ulang.
          </div>
        )}
      </div>

      {/* Search and Filter */}
      <div className="mb-8 animate-slide-up">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Cari kelas berdasarkan nama atau deskripsi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showJoinedOnly}
                  onChange={(e) => setShowJoinedOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Hanya kelas yang sudah diikuti</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-scale-in">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Total Kelas</p>
              <p className="text-2xl font-bold text-slate-800">{availableClasses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Kelas Diikuti</p>
              <p className="text-2xl font-bold text-slate-800">{joinedClasses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Tersedia</p>
              <p className="text-2xl font-bold text-slate-800">{availableClasses.length - joinedClasses.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-bounce-in">
        {filteredClasses.map((kelas, index) => {
          const isJoined = isClassJoined(kelas.ID);
          const isLoading = joinLoading === kelas.ID;

          return (
            <div
              key={kelas.ID}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col h-full">
                {/* Class Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  
                  {isJoined && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      Sudah Bergabung
                    </span>
                  )}
                </div>

                {/* Class Info */}
                <h3 className="text-xl font-bold text-slate-800 mb-2">{kelas.name}</h3>
                <p className="text-slate-600 mb-4 flex-grow leading-relaxed">{kelas.description}</p>

                {/* Action Button */}
                <div className="mt-auto">
                  {isJoined ? (
                    <button
                      onClick={() => navigate(`/kelas/${kelas.ID}`)}
                      className="w-full btn-secondary"
                    >
                      Lihat Kelas
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinClass(kelas.ID)}
                      disabled={isLoading}
                      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Bergabung...</span>
                        </div>
                      ) : (
                        'Bergabung Sekarang'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredClasses.length === 0 && (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Tidak ada kelas ditemukan</h3>
          <p className="text-slate-600 mb-6">
            {showJoinedOnly 
              ? 'Anda belum bergabung dengan kelas apapun.'
              : 'Coba ubah kata kunci pencarian Anda.'
            }
          </p>
          {showJoinedOnly && (
            <button
              onClick={() => setShowJoinedOnly(false)}
              className="btn-primary"
            >
              Lihat Semua Kelas
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default JoinKelasPage;
