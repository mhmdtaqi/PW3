import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../services/api";

const ManageSoal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const kuisId = searchParams.get("kuis_id");

  const [soalList, setSoalList] = useState([]);
  const [selectedSoal, setSelectedSoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    options: {
      A: "",
      B: "",
      C: "",
      D: "",
    },
    correct_answer: "",
    kuis_id: kuisId,
  });

  useEffect(() => {
    if (!kuisId) {
      navigate("/daftar-kelas");
      return;
    }
    fetchSoal();
  }, [kuisId]);

  const fetchSoal = async () => {
    try {
      setLoading(true);
      const response = await api.getSoalByKuisID(kuisId);
      console.log("Response getSoalByKuisID:", response);
      if (response.success) {
        const soalList = response.data.map((soal) => {
          try {
            let options = {};
            if (soal.Options || soal.options_json) {
              options = JSON.parse(soal.Options || soal.options_json);
            }
            console.log("Options untuk soal", soal.ID, ":", options);
            return {
              ...soal,
              parsedOptions: options,
              question: soal.Question || soal.question,
              correct_answer: soal.Correct_answer || soal.correct_answer,
            };
          } catch (e) {
            console.error("Error parsing options untuk soal", soal.ID, ":", e);
            return soal;
          }
        });
        console.log("Soal list setelah parsing:", soalList);
        setSoalList(soalList);
      }
    } catch (error) {
      console.error("Error dalam fetchSoal:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (soal) => {
    setSelectedSoal(soal);
    let options = {
      A: "",
      B: "",
      C: "",
      D: "",
    };
    try {
      if (soal.Options) {
        const parsedOptions = JSON.parse(soal.Options);
        if (parsedOptions && typeof parsedOptions === "object") {
          options = parsedOptions;
        }
      }
    } catch (e) {
      console.error("Error parsing options:", e);
    }
    setFormData({
      question: soal.Question || soal.question || "",
      options: options,
      correct_answer: soal.Correct_answer || soal.correct_answer || "",
      kuis_id: soal.Kuis_id || soal.kuis_id || kuisId,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validasi form
      if (!formData.question.trim()) {
        setError("Pertanyaan tidak boleh kosong");
        return;
      }

      if (!formData.correct_answer) {
        setError("Pilih jawaban yang benar");
        return;
      }

      // Validasi semua opsi jawaban harus diisi
      const allOptionsFilled = Object.values(formData.options).every(
        (option) => option.trim() !== ""
      );
      if (!allOptionsFilled) {
        setError("Semua opsi jawaban harus diisi");
        return;
      }

      const soalData = {
        question: formData.question,
        options: formData.options,
        correct_answer: formData.correct_answer,
        kuis_id: parseInt(kuisId),
      };

      console.log("Mengirim data soal:", soalData);

      if (selectedSoal) {
        await api.updateSoal(selectedSoal.ID, soalData);
      } else {
        await api.addSoal(soalData);
      }

      // Reset form
      setFormData({
        question: "",
        options: {
          A: "",
          B: "",
          C: "",
          D: "",
        },
        correct_answer: "",
      });
      setSelectedSoal(null);
      fetchSoal();
    } catch (error) {
      console.error("Error dalam handleSubmit:", error);
      setError(error.message || "Terjadi kesalahan saat menyimpan soal");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus soal ini?")) {
      try {
        setLoading(true);
        await api.deleteSoal(id);
        fetchSoal();
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <div className="p-4">Memuat...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Kembali
        </button>
        <h1 className="text-2xl font-bold mb-4">
          {selectedSoal ? "Edit Soal" : "Tambah Soal Baru"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 mb-6"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Pertanyaan
          </label>
          <textarea
            value={formData.question}
            onChange={(e) =>
              setFormData({ ...formData, question: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Pilihan Jawaban
          </label>
          {Object.entries(formData.options || {}).map(([key, value]) => (
            <div key={key} className="mb-2">
              <input
                type="text"
                value={value}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    options: {
                      ...formData.options,
                      [key]: e.target.value,
                    },
                  })
                }
                placeholder={`Pilihan ${key}`}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Jawaban Benar
          </label>
          <select
            value={formData.correct_answer}
            onChange={(e) =>
              setFormData({ ...formData, correct_answer: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Pilih jawaban benar</option>
            {Object.keys(formData.options || {}).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading
            ? "Menyimpan..."
            : selectedSoal
            ? "Update Soal"
            : "Tambah Soal"}
        </button>
      </form>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Daftar Soal</h2>
        {soalList.length === 0 ? (
          <p className="text-gray-500">Belum ada soal</p>
        ) : (
          <div className="space-y-4">
            {soalList.map((soal) => {
              let options = {};
              try {
                if (soal.Options || soal.options_json) {
                  options = JSON.parse(soal.Options || soal.options_json);
                }
              } catch (e) {
                console.error(
                  "Error parsing options untuk soal",
                  soal.ID,
                  ":",
                  e
                );
              }

              console.log(
                "Jawaban benar untuk soal",
                soal.ID,
                ":",
                soal.Correct_answer || soal.correct_answer
              );
              console.log("Options untuk soal", soal.ID, ":", options);

              return (
                <div
                  key={soal.ID || soal.id}
                  className="border rounded p-4 hover:bg-gray-50"
                >
                  <h3 className="font-medium mb-2">
                    {soal.Question || soal.question}
                  </h3>
                  <div className="space-y-1 mb-2">
                    {Object.entries(options).map(([key, value]) => (
                      <div
                        key={key}
                        className={`p-2 rounded ${
                          key === (soal.Correct_answer || soal.correct_answer)
                            ? "bg-green-50 border border-green-200"
                            : "bg-gray-50"
                        }`}
                      >
                        <span className="font-medium">{key}.</span> {value}
                        {key ===
                          (soal.Correct_answer || soal.correct_answer) && (
                          <span className="ml-2 text-green-600">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => handleEdit(soal)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(soal.ID || soal.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSoal;
