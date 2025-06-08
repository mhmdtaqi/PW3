import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../services/api";

const ManageKuis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const kelasId = searchParams.get("kelas_id");

  const [kuisList, setKuisList] = useState([]);
  const [selectedKuis, setSelectedKuis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kategoriList, setKategoriList] = useState([]);
  const [tingkatanList, setTingkatanList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [pendidikanList, setPendidikanList] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    is_private: false,
    kategori_id: "",
    tingkatan_id: "",
    kelas_id: kelasId || "",
    pendidikan_id: "",
    soal: [
      {
        question: "",
        options: {
          A: "",
          B: "",
          C: "",
          D: "",
        },
        correct_answer: "",
      },
    ],
  });

  useEffect(() => {
    if (!kelasId) {
      navigate("/daftar-kelas");
      return;
    }
    fetchData();
  }, [kelasId, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [kuisRes, kategoriRes, tingkatanRes, kelasRes, pendidikanRes] =
        await Promise.all([
          api.getKuisByKelasId(kelasId),
          api.getKategori(),
          api.getTingkatan(),
          api.getKelas(),
          api.getPendidikan(),
        ]);

      if (kuisRes.success) setKuisList(kuisRes.data);
      if (kategoriRes.success) setKategoriList(kategoriRes.data);
      if (tingkatanRes.success) setTingkatanList(tingkatanRes.data);
      if (kelasRes.success) setKelasList(kelasRes.data);
      if (pendidikanRes.success) setPendidikanList(pendidikanRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSoal = () => {
    setFormData((prev) => ({
      ...prev,
      soal: [
        ...prev.soal,
        {
          question: "",
          options: {
            A: "",
            B: "",
            C: "",
            D: "",
          },
          correct_answer: "",
        },
      ],
    }));
  };

  const handleRemoveSoal = (index) => {
    setFormData((prev) => ({
      ...prev,
      soal: prev.soal.filter((_, i) => i !== index),
    }));
  };

  const handleSoalChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      soal: prev.soal.map((soal, i) =>
        i === index ? { ...soal, [field]: value } : soal
      ),
    }));
  };

  const handleOptionChange = (soalIndex, optionKey, value) => {
    setFormData((prev) => ({
      ...prev,
      soal: prev.soal.map((soal, i) =>
        i === soalIndex
          ? {
              ...soal,
              options: {
                ...soal.options,
                [optionKey]: value,
              },
            }
          : soal
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Buat kuis baru
      const kuisData = {
        title: formData.title,
        description: formData.description,
        is_private: formData.is_private,
        kategori_id: parseInt(formData.kategori_id),
        tingkatan_id: parseInt(formData.tingkatan_id),
        kelas_id: parseInt(formData.kelas_id),
        pendidikan_id: parseInt(formData.pendidikan_id),
      };

      const kuisResponse = await api.addKuis(kuisData);
      if (!kuisResponse.success) {
        throw new Error(kuisResponse.message);
      }

      const kuisId = kuisResponse.data.ID || kuisResponse.data.id;

      // Tambahkan soal-soal
      for (const soal of formData.soal) {
        const soalData = {
          question: soal.question,
          options_json: JSON.stringify(soal.options),
          correct_answer: soal.correct_answer,
          kuis_id: kuisId,
        };

        const soalResponse = await api.addSoal(soalData);
        if (!soalResponse.success) {
          throw new Error(soalResponse.message);
        }
      }

      alert("Kuis dan soal berhasil ditambahkan");
      setFormData({
        title: "",
        description: "",
        is_private: false,
        kategori_id: "",
        tingkatan_id: "",
        kelas_id: "",
        pendidikan_id: "",
        soal: [
          {
            question: "",
            options: {
              A: "",
              B: "",
              C: "",
              D: "",
            },
            correct_answer: "",
          },
        ],
      });
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Memuat...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kelola Kuis</h1>
        <button
          onClick={() => navigate(`/kelas/${kelasId}`)}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
        >
          Kembali ke Kelas
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informasi Kuis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Informasi Kuis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judul Kuis
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-2 border rounded"
                rows="2"
                required
              />
            </div>

            {/* Privacy Setting */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Jenis Kuis
              </label>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    id="public"
                    name="privacy"
                    checked={!formData.is_private}
                    onChange={() => setFormData({ ...formData, is_private: false })}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <label htmlFor="public" className="flex items-center cursor-pointer">
                      <span className="text-2xl mr-2">🌍</span>
                      <div>
                        <div className="font-medium text-gray-900">Kuis Public</div>
                        <div className="text-sm text-gray-500">Semua siswa dapat melihat dan mengerjakan kuis ini</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    id="private"
                    name="privacy"
                    checked={formData.is_private}
                    onChange={() => setFormData({ ...formData, is_private: true })}
                    className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <label htmlFor="private" className="flex items-center cursor-pointer">
                      <span className="text-2xl mr-2">🔒</span>
                      <div>
                        <div className="font-medium text-gray-900">Kuis Private</div>
                        <div className="text-sm text-gray-500">Hanya anggota kelas yang dapat melihat dan mengerjakan kuis ini</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {formData.is_private && (
                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-orange-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-orange-800">Kuis Private</h4>
                      <p className="text-sm text-orange-700 mt-1">
                        Kuis ini hanya akan terlihat oleh siswa yang sudah bergabung dengan kelas yang dipilih.
                        Siswa perlu menggunakan kode join kelas untuk dapat mengakses kuis ini.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                value={formData.kategori_id}
                onChange={(e) =>
                  setFormData({ ...formData, kategori_id: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Pilih Kategori</option>
                {kategoriList.map((kategori) => (
                  <option
                    key={kategori.ID || kategori.id}
                    value={kategori.ID || kategori.id}
                  >
                    {kategori.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tingkatan
              </label>
              <select
                value={formData.tingkatan_id}
                onChange={(e) =>
                  setFormData({ ...formData, tingkatan_id: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Pilih Tingkatan</option>
                {tingkatanList.map((tingkatan) => (
                  <option
                    key={tingkatan.ID || tingkatan.id}
                    value={tingkatan.ID || tingkatan.id}
                  >
                    {tingkatan.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kelas
              </label>
              <select
                value={formData.kelas_id}
                onChange={(e) =>
                  setFormData({ ...formData, kelas_id: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Pilih Kelas</option>
                {kelasList.map((kelas) => (
                  <option
                    key={kelas.ID || kelas.id}
                    value={kelas.ID || kelas.id}
                  >
                    {kelas.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pendidikan
              </label>
              <select
                value={formData.pendidikan_id}
                onChange={(e) =>
                  setFormData({ ...formData, pendidikan_id: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Pilih Pendidikan</option>
                {pendidikanList.map((pendidikan) => (
                  <option
                    key={pendidikan.ID || pendidikan.id}
                    value={pendidikan.ID || pendidikan.id}
                  >
                    {pendidikan.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Daftar Soal */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Daftar Soal</h2>
            <button
              type="button"
              onClick={handleAddSoal}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Tambah Soal
            </button>
          </div>

          <div className="space-y-6">
            {formData.soal.map((soal, index) => (
              <div key={index} className="border rounded p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium">Soal {index + 1}</h3>
                  {formData.soal.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSoal(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Hapus Soal
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pertanyaan
                    </label>
                    <textarea
                      value={soal.question}
                      onChange={(e) =>
                        handleSoalChange(index, "question", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      rows="3"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Pilihan Jawaban
                    </label>
                    {["A", "B", "C", "D"].map((key) => (
                      <div key={key} className="flex items-center space-x-2">
                        <span className="font-medium w-6">{key}.</span>
                        <input
                          type="text"
                          value={soal.options[key]}
                          onChange={(e) =>
                            handleOptionChange(index, key, e.target.value)
                          }
                          className="flex-1 p-2 border rounded"
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jawaban Benar
                    </label>
                    <select
                      value={soal.correct_answer}
                      onChange={(e) =>
                        handleSoalChange(
                          index,
                          "correct_answer",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Pilih jawaban benar</option>
                      {["A", "B", "C", "D"].map((key) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Simpan Kuis
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageKuis;
