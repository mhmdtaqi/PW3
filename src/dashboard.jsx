import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Selamat Datang di BrainQuiz
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Platform pembelajaran interaktif untuk meningkatkan pengetahuan Anda
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card Kategori */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Kategori Pembelajaran
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Jelajahi berbagai kategori pembelajaran yang tersedia</p>
                </div>
                <div className="mt-5">
                  <Link
                    to="/daftar-kategori"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Lihat Kategori
                  </Link>
                </div>
              </div>
            </div>

            {/* Card Tingkatan */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Tingkatan Kesulitan
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Pilih tingkatan kesulitan sesuai kemampuan Anda</p>
                </div>
                <div className="mt-5">
                  <Link
                    to="/daftar-tingkatan"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Lihat Tingkatan
                  </Link>
                </div>
              </div>
            </div>

            {/* Card Pendidikan */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Jenjang Pendidikan
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Materi pembelajaran untuk berbagai jenjang pendidikan</p>
                </div>
                <div className="mt-5">
                  <Link
                    to="/daftar-pendidikan"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Lihat Pendidikan
                  </Link>
                </div>
              </div>
            </div>

            {/* Card Kelas */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Kelas Pembelajaran
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Bergabung dengan kelas pembelajaran yang sesuai</p>
                </div>
                <div className="mt-5">
                  <Link
                    to="/daftar-kelas"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Lihat Kelas
                  </Link>
                </div>
              </div>
            </div>

            {/* Card Statistik */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Statistik Pembelajaran
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Lihat perkembangan dan pencapaian pembelajaran Anda</p>
                </div>
                <div className="mt-5">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Lihat Statistik
                  </button>
                </div>
              </div>
            </div>

            {/* Card Profil */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Profil Pengguna
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Kelola profil dan pengaturan akun Anda</p>
                </div>
                <div className="mt-5">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Lihat Profil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
