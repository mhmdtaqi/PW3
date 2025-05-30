import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";

const DetailKelas = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kelas, setKelas] = useState(null);
  const [kuisList, setKuisList] = useState([]);
  const [selectedKuis, setSelectedKuis] = useState(null);
  const [soalList, setSoalList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ambil semua kelas
        const allKelas = await api.getKelas();
        console.log("Semua kelas:", allKelas);

        // Cari kelas berdasarkan ID dari data yang sudah ada
        const kelasData = allKelas.data.find(
          (k) => k.ID === parseInt(id) || k.id === parseInt(id)
        );

        if (!kelasData) {
          throw new Error("Kelas tidak ditemukan");
        }

        setKelas(kelasData);

        // Ambil data kuis
        const kuisData = await api.getKuis();
        const filteredKuis = kuisData.data.filter(
          (kuis) => kuis.kelas_id === parseInt(id)
        );
        setKuisList(filteredKuis);

        // Ambil role dari localStorage
        const userRole = localStorage.getItem("role");
        setUserRole(userRole);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "Terjadi kesalahan saat mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleKuisClick = async (kuis) => {
    try {
      setLoading(true);
      console.log("Mengambil soal untuk kuis ID:", kuis.ID || kuis.id);

      if (!kuis.ID && !kuis.id) {
        throw new Error("ID kuis tidak valid");
      }

      const soalResponse = await api.getSoalByKuisID(kuis.ID || kuis.id);
      console.log("Response soal lengkap:", soalResponse);

      if (!soalResponse.success) {
        throw new Error(soalResponse.message || "Gagal memuat soal");
      }

      // Simpan jawaban yang benar
      const correctAnswersMap = {};
      soalResponse.data.forEach((soal) => {
        correctAnswersMap[soal.ID || soal.id] = soal.correct_answer;
      });
      setCorrectAnswers(correctAnswersMap);

      setSoalList(soalResponse.data);
      setSelectedKuis(kuis);
      setAnswers({});
      setShowResults(false);
      setScore(null);
    } catch (err) {
      console.error("Error dalam handleKuisClick:", err);
      setError(err.message || "Gagal memuat soal");
      setSoalList([]);
      setSelectedKuis(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (soalId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [soalId]: answer,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Validasi semua soal telah dijawab
      const unansweredQuestions = soalList.filter(
        (soal) => !answers[soal.ID || soal.id]
      );

      if (unansweredQuestions.length > 0) {
        setError("Mohon jawab semua soal terlebih dahulu");
        return;
      }

      // Format jawaban sesuai dengan yang diharapkan API
      const formattedAnswers = Object.entries(answers).map(
        ([soalId, answer]) => ({
          soal_id: parseInt(soalId),
          selected_answer: answer,
          kuis_id: parseInt(selectedKuis.ID || selectedKuis.id),
        })
      );

      console.log("Mengirim jawaban:", formattedAnswers);

      const response = await api.submitJawaban(
        selectedKuis.ID || selectedKuis.id,
        formattedAnswers
      );

      if (!response.success) {
        throw new Error(response.message || "Gagal mengirim jawaban");
      }

      console.log("Response submit jawaban:", response);
      setScore(response.data);
      setShowResults(true);
    } catch (err) {
      console.error("Error dalam handleSubmit:", err);
      setError(err.message || "Gagal mengirim jawaban");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Memuat...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!kelas) return <div className="p-4">Kelas tidak ditemukan</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <button
          onClick={() => navigate("/daftar-kelas")}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Kembali ke Daftar Kelas
        </button>
        <h1 className="text-2xl font-bold mb-2">{kelas.name}</h1>
        <p className="text-gray-600">{kelas.description}</p>
      </div>

      {/* Tombol Kelola Soal untuk Admin/Teacher */}
      {(userRole === "admin" || userRole === "teacher") && selectedKuis && (
        <div className="mb-6">
          <Link
            to={`/admin/manage-soal?kuis_id=${
              selectedKuis.ID || selectedKuis.id
            }`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Kelola Soal
          </Link>
        </div>
      )}

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
                  key={kuis.ID || kuis.id}
                  className={`p-3 rounded cursor-pointer transition-colors ${
                    selectedKuis?.ID === kuis.ID || selectedKuis?.id === kuis.id
                      ? "bg-blue-100 border-blue-500"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleKuisClick(kuis);
                  }}
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

              {!showResults ? (
                <div className="space-y-4">
                  {soalList && soalList.length > 0 ? (
                    soalList.map((soal, index) => {
                      let options = [];
                      try {
                        if (soal.options_json) {
                          const parsedOptions = JSON.parse(soal.options_json);
                          if (
                            parsedOptions &&
                            Object.keys(parsedOptions).length > 0
                          ) {
                            options = Object.entries(parsedOptions).map(
                              ([key, value]) => ({
                                key,
                                value,
                              })
                            );
                          }
                        }
                      } catch (err) {
                        console.error(
                          `Error parsing options untuk soal ${index + 1}:`,
                          err
                        );
                        options = [];
                      }

                      return (
                        <div
                          key={soal.ID || soal.id}
                          className="border rounded p-4 mb-4"
                        >
                          <h3 className="font-medium mb-4">
                            Soal {index + 1}: {soal.question}
                          </h3>
                          {options.length > 0 ? (
                            <div className="space-y-3">
                              {options.map((option, optIndex) => (
                                <label
                                  key={optIndex}
                                  className={`flex items-center space-x-3 p-3 rounded hover:bg-gray-50 cursor-pointer border ${
                                    showResults
                                      ? option.value ===
                                        correctAnswers[soal.ID || soal.id]
                                        ? "border-green-500 bg-green-50"
                                        : answers[soal.ID || soal.id] ===
                                          option.value
                                        ? "border-red-500 bg-red-50"
                                        : "border-gray-200"
                                      : "border-gray-200"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`soal-${soal.ID || soal.id}`}
                                    value={option.value}
                                    checked={
                                      answers[soal.ID || soal.id] ===
                                      option.value
                                    }
                                    onChange={() =>
                                      handleAnswerChange(
                                        soal.ID || soal.id,
                                        option.value
                                      )
                                    }
                                    className="form-radio text-blue-600 h-4 w-4"
                                    disabled={showResults}
                                  />
                                  <span className="text-gray-700">
                                    <span className="font-medium">
                                      {option.key}.
                                    </span>{" "}
                                    {option.value}
                                  </span>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                              <p className="text-yellow-700">
                                Pilihan jawaban belum tersedia untuk soal ini.
                                Mohon hubungi pengajar untuk menambahkan pilihan
                                jawaban.
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500">
                      Tidak ada soal yang tersedia
                    </p>
                  )}
                  {soalList && soalList.length > 0 && (
                    <div className="mt-4">
                      {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                          {error}
                        </div>
                      )}
                      <button
                        onClick={handleSubmit}
                        disabled={
                          Object.keys(answers).length !== soalList.length ||
                          loading
                        }
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {loading ? "Mengirim..." : "Kirim Jawaban"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Hasil Kuis</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-4">
                    Skor: {score.score}
                  </p>
                  <p className="text-gray-600 mb-4">
                    Jawaban Benar: {score.correct_answer} dari {soalList.length}
                  </p>
                  <div className="space-y-4">
                    {soalList.map((soal, index) => (
                      <div
                        key={soal.ID || soal.id}
                        className="border rounded p-4"
                      >
                        <h4 className="font-medium mb-2">
                          Soal {index + 1}: {soal.question}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Jawaban Anda: {answers[soal.ID || soal.id]}
                        </p>
                        <p className="text-sm text-gray-600">
                          Jawaban Benar: {correctAnswers[soal.ID || soal.id]}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setShowResults(false);
                      setAnswers({});
                      setScore(null);
                    }}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Coba Lagi
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500">Pilih kuis untuk mulai mengerjakan</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailKelas;
