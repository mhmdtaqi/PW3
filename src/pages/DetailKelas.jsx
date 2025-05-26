import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

const DetailKelas = () => {
  const { id } = useParams();
  const [kelas, setKelas] = useState(null);
  const [kuisList, setKuisList] = useState([]);
  const [selectedKuis, setSelectedKuis] = useState(null);
  const [soalList, setSoalList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchKelasData();
  }, [id]);

  const fetchKelasData = async () => {
    try {
      setLoading(true);
      // Ambil data kelas
      const kelasResponse = await api.getKelas();
      const kelasData = kelasResponse.data.find((k) => k.id === parseInt(id));
      setKelas(kelasData);

      // Ambil data kuis untuk kelas ini
      const kuisResponse = await api.getKuis();
      const filteredKuis = kuisResponse.data.filter(
        (kuis) => kuis.kelas_id === parseInt(id)
      );
      setKuisList(filteredKuis);
    } catch (err) {
      setError("Gagal memuat data kelas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKuisClick = async (kuisId) => {
    try {
      const soalResponse = await api.getSoalByKuisID(kuisId);
      setSoalList(soalResponse.data);
      setSelectedKuis(kuisList.find((k) => k.id === kuisId));
    } catch (err) {
      setError("Gagal memuat soal");
      console.error(err);
    }
  };

  if (loading) return <div className="p-4">Memuat...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!kelas) return <div className="p-4">Kelas tidak ditemukan</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{kelas.name}</h1>
      <p className="text-gray-600 mb-6">{kelas.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daftar Kuis */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Daftar Kuis</h2>
          {kuisList.length === 0 ? (
            <p className="text-gray-500">Belum ada kuis dalam kelas ini</p>
          ) : (
            <div className="space-y-2">
              {kuisList.map((kuis) => (
                <div
                  key={kuis.id}
                  className={`p-3 rounded cursor-pointer transition-colors ${
                    selectedKuis?.id === kuis.id
                      ? "bg-blue-100 border-blue-500"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => handleKuisClick(kuis.id)}
                >
                  <h3 className="font-medium">{kuis.title}</h3>
                  <p className="text-sm text-gray-600">{kuis.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Kuis dan Soal */}
        <div className="bg-white rounded-lg shadow p-4">
          {selectedKuis ? (
            <>
              <h2 className="text-xl font-semibold mb-4">
                {selectedKuis.title}
              </h2>
              <p className="text-gray-600 mb-4">{selectedKuis.description}</p>

              <div className="space-y-4">
                {soalList.map((soal, index) => (
                  <div key={soal.id} className="border rounded p-4">
                    <h3 className="font-medium mb-2">
                      Soal {index + 1}: {soal.question}
                    </h3>
                    <div className="space-y-2">
                      {JSON.parse(soal.options_json).map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-2 rounded ${
                            option === soal.correct_answer
                              ? "bg-green-100 border-green-500"
                              : "bg-gray-50"
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500">Pilih kuis untuk melihat detail</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailKelas;
