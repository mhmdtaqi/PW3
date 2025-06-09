<<<<<<< HEAD
const BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "/api" : "https://brainquiz0.up.railway.app");

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Terjadi kesalahan pada server");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Server error: ${response.status}`);
  }
  return data;
};

export const api = {
  // Kategori
  getKategori: async () => {
    try {
      const response = await fetch(`${BASE_URL}/kategori/get-kategori`, {
        method: "GET",
        headers: getAuthHeader(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching kategori:", error);
      throw error;
    }
  },

  addKategori: async (data) => {
    try {
      const kategoriData = {
        name: data.name,
        description: data.description,
      };

      const response = await fetch(`${BASE_URL}/kategori/add-kategori`, {
        method: "POST",
        headers: getAuthHeader(),
        credentials: 'include',
        body: JSON.stringify(kategoriData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error adding kategori:", error);
      throw error;
    }
  },

  updateKategori: async (id, data) => {
    try {
      const kategoriData = {
        name: data.name,
        description: data.description,
      };

      const response = await fetch(
        `${BASE_URL}/kategori/update-kategori/${id}`,
        {
          method: "PATCH",
          headers: getAuthHeader(),
          credentials: 'include',
          body: JSON.stringify(kategoriData),
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error("Error updating kategori:", error);
      throw error;
    }
  },

  deleteKategori: async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/kategori/delete-kategori/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeader(),
          credentials: 'include',
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error("Error deleting kategori:", error);
      throw error;
    }
  },

  // Tingkatan
  getTingkatan: async () => {
    try {
      const response = await fetch(`${BASE_URL}/tingkatan/get-tingkatan`, {
        method: "GET",
        headers: getAuthHeader(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching tingkatan:", error);
      throw error;
    }
  },

  addTingkatan: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/tingkatan/add-tingkatan`, {
        method: "POST",
        headers: getAuthHeader(),
        credentials: 'include',
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error adding tingkatan:", error);
      throw error;
    }
  },

  updateTingkatan: async (id, data) => {
    try {
      const response = await fetch(
        `${BASE_URL}/tingkatan/update-tingkatan/${id}`,
        {
          method: "PATCH",
          headers: getAuthHeader(),
          credentials: 'include',
          body: JSON.stringify(data),
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error("Error updating tingkatan:", error);
      throw error;
    }
  },

  deleteTingkatan: async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/tingkatan/delete-tingkatan/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeader(),
          credentials: 'include',
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error("Error deleting tingkatan:", error);
      throw error;
    }
  },

  // Pendidikan
  getPendidikan: async () => {
    try {
      const response = await fetch(`${BASE_URL}/pendidikan/get-pendidikan`, {
        method: "GET",
        headers: getAuthHeader(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching pendidikan:", error);
      throw error;
    }
  },

  addPendidikan: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/pendidikan/add-pendidikan`, {
        method: "POST",
        headers: getAuthHeader(),
        credentials: 'include',
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error adding pendidikan:", error);
      throw error;
    }
  },

  updatePendidikan: async (id, data) => {
    try {
      const response = await fetch(
        `${BASE_URL}/pendidikan/update-pendidikan/${id}`,
        {
          method: "PATCH",
          headers: getAuthHeader(),
          credentials: 'include',
          body: JSON.stringify(data),
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error("Error updating pendidikan:", error);
      throw error;
    }
  },

  deletePendidikan: async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/pendidikan/delete-pendidikan/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeader(),
          credentials: 'include',
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error("Error deleting pendidikan:", error);
      throw error;
    }
  },

  // Kelas
  getKelas: async () => {
    try {
      const response = await fetch(`${BASE_URL}/kelas/get-kelas`, {
        method: "GET",
        headers: getAuthHeader(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching kelas:", error);
      throw error;
    }
  },

  getKelasById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/kelas/get-kelas/${id}`, {
        method: "GET",
        headers: getAuthHeader(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching kelas by id:", error);
      throw error;
    }
  },

  addKelas: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/kelas/add-kelas`, {
        method: "POST",
        headers: getAuthHeader(),
        credentials: 'include',
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error adding kelas:", error);
      throw error;
    }
  },

  updateKelas: async (id, data) => {
    try {
      const response = await fetch(`${BASE_URL}/kelas/update-kelas/${id}`, {
        method: "PATCH",
        headers: getAuthHeader(),
        credentials: 'include',
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error updating kelas:", error);
      throw error;
    }
  },

  deleteKelas: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/kelas/delete-kelas/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error deleting kelas:", error);
      throw error;
    }
  },

  // Join Class with Code
  getJoinedClasses: async () => {
    try {
      const response = await fetch(`${BASE_URL}/kelas/get-joined-classes`, {
        method: "GET",
        headers: getAuthHeader(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching joined classes:", error);
      // Return empty result for now (API not implemented yet)
      return {
        success: true,
        data: [], // Empty array = no joined classes yet
        message: "API not implemented yet"
      };
    }
  },

  joinClassWithCode: async (joinCode) => {
    try {
      const response = await fetch(`${BASE_URL}/kelas/join-with-code`, {
        method: "POST",
        headers: getAuthHeader(),
        credentials: 'include',
        body: JSON.stringify({ join_code: joinCode }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error joining class with code:", error);
      // Return mock response for now (API not implemented yet)
      return {
        success: false,
        message: "API join-with-code belum diimplementasi di backend"
      };
    }
  },

  leaveClass: async (kelasId) => {
    try {
      const response = await fetch(`${BASE_URL}/kelas/leave-class/${kelasId}`, {
        method: "DELETE",
        headers: getAuthHeader(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error leaving class:", error);
      throw error;
    }
  },

  // Get students in a class (for future implementation)
  getStudentsByKelasId: async (kelasId) => {
    try {
      const response = await fetch(`${BASE_URL}/kelas/get-students/${kelasId}`, {
        method: "GET",
        headers: getAuthHeader(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching students by kelas id:", error);
      // Return mock response for now (API not implemented yet)
      return {
        success: true,
        data: [], // Empty array = no students yet
        message: "API get-students belum diimplementasi di backend"
      };
    }
  },

  // Kuis
  getKuis: async () => {
    try {
      const response = await fetch(`${BASE_URL}/kuis/get-kuis`, {
        method: "GET",
        headers: getAuthHeader(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching kuis:", error);
      throw error;
    }
  },

  getKuisByKelasId: async (kelasId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/kuis/filter-kuis?kelas_id=${kelasId}`,
        {
          method: "GET",
          headers: getAuthHeader(),
          credentials: 'include',
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching kuis by kelas id:", error);
      throw error;
    }
  },

  addKuis: async (data) => {
    try {
      const kuisData = {
        title: data.title,
        description: data.description,
        kategori_id: data.kategori_id,
        tingkatan_id: data.tingkatan_id,
        kelas_id: data.kelas_id,
        pendidikan_id: data.pendidikan_id,
      };

      const response = await fetch(`${BASE_URL}/kuis/add-kuis`, {
        method: "POST",
        headers: getAuthHeader(),
        credentials: 'include',
        body: JSON.stringify(kuisData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error adding kuis:", error);
      throw error;
    }
  },

  updateKuis: async (id, data) => {
    try {
      const kuisData = {
        title: data.title,
        description: data.description,
        kategori_id: data.kategori_id,
        tingkatan_id: data.tingkatan_id,
        kelas_id: data.kelas_id,
        pendidikan_id: data.pendidikan_id,
      };

      const response = await fetch(`${BASE_URL}/kuis/update-kuis/${id}`, {
        method: "PATCH",
        headers: getAuthHeader(),
        credentials: 'include',
        body: JSON.stringify(kuisData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error updating kuis:", error);
      throw error;
    }
  },

  deleteKuis: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/kuis/delete-kuis/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error deleting kuis:", error);
      throw error;
    }
  },

  // Soal
  getSoal: async () => {
    try {
      const response = await fetch(`${BASE_URL}/soal/get-soal`, {
        method: "GET",
        headers: getAuthHeader(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching soal:", error);
      throw error;
    }
  },

  getSoalByKuisID: async (kuisId) => {
    try {
      const response = await fetch(`${BASE_URL}/soal/get-soal/${kuisId}`, {
        method: "GET",
        headers: getAuthHeader(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching soal by kuis ID:", error);
      throw error;
    }
  },

  addSoal: async (data) => {
    try {
      // Ensure options is properly formatted as JSON string
      let optionsJson;
      if (typeof data.options === 'string') {
        optionsJson = data.options;
      } else if (data.options && typeof data.options === 'object') {
        optionsJson = JSON.stringify(data.options);
      } else if (data.options_json) {
        optionsJson = data.options_json;
      } else {
        throw new Error('Options data is required');
      }

      const soalData = {
        question: data.question,
        options_json: optionsJson,  // This will be mapped to Options field in backend
        correct_answer: data.correct_answer,
        kuis_id: parseInt(data.kuis_id),
      };

      const response = await fetch(`${BASE_URL}/soal/add-soal`, {
        method: "POST",
        headers: getAuthHeader(),
        credentials: 'include',
        body: JSON.stringify(soalData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error adding soal:", error);
      throw error;
    }
  },

  updateSoal: async (id, data) => {
    try {
      // Ensure options is properly formatted as JSON string
      let optionsJson;
      if (typeof data.options === 'string') {
        optionsJson = data.options;
      } else if (data.options && typeof data.options === 'object') {
        optionsJson = JSON.stringify(data.options);
      } else if (data.options_json) {
        optionsJson = data.options_json;
      } else {
        throw new Error('Options data is required');
      }

      const soalData = {
        question: data.question,
        options_json: optionsJson,
        correct_answer: data.correct_answer,
        kuis_id: parseInt(data.kuis_id),
      };

      const response = await fetch(`${BASE_URL}/soal/update-soal/${id}`, {
        method: "PATCH",
        headers: getAuthHeader(),
        credentials: 'include',
        body: JSON.stringify(soalData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error in updateSoal:", error);
      throw error;
    }
  },

  deleteSoal: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/soal/delete-soal/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error deleting soal:", error);
      throw error;
    }
  },

  // Hasil Kuis
  submitJawaban: async (answers) => {
    try {
      // Format answers according to backend SoalAnswer model
      const formattedAnswers = answers.map((answer) => ({
        Soal_id: parseInt(answer.soal_id),      // Backend expects Soal_id
        Answer: answer.selected_answer,         // Backend expects Answer
        User_id: parseInt(answer.user_id),      // Backend expects User_id
      }));

      const response = await fetch(`${BASE_URL}/hasil-kuis/submit-jawaban`, {
        method: "POST",
        headers: getAuthHeader(),
        credentials: 'include',
        body: JSON.stringify(formattedAnswers),  // Send array directly, not wrapped in object
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Gagal mengirim jawaban");
      }
      return data;
    } catch (error) {
      console.error("Error dalam submitJawaban:", error);
      throw error;
    }
  },
};
=======
const BASE_URL =
  import.meta.env.VITE_API_URL || "https://brainquiz0.up.railway.app";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token tidak ditemukan");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
      throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
    }
    throw new Error("Terjadi kesalahan pada server");
  }

  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
      throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
    }
    throw new Error(data.message || "Terjadi kesalahan pada server");
  }
  return data;
};

export const api = {
  // Kategori
  getKategori: async () => {
    try {
      const response = await fetch(`${BASE_URL}/kategori/get-kategori`, {
        method: "GET",
        headers: getAuthHeader(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching kategori:", error);
      throw error;
    }
  },

  addKategori: async (data) => {
    try {
      const kategoriData = {
        name: data.name,
        description: data.description,
      };
      console.log("Sending data to addKategori:", kategoriData);

      const response = await fetch(`${BASE_URL}/kategori/add-kategori`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(kategoriData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error adding kategori:", error);
      throw error;
    }
  },

  updateKategori: async (id, data) => {
    try {
      const kategoriData = {
        name: data.name,
        description: data.description,
      };
      console.log("Sending data to updateKategori:", {
        id,
        data: kategoriData,
      });

      const response = await fetch(
        `${BASE_URL}/kategori/update-kategori/${id}`,
        {
          method: "PATCH",
          headers: getAuthHeader(),
          body: JSON.stringify(kategoriData),
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error("Error updating kategori:", error);
      throw error;
    }
  },

  deleteKategori: async (id) => {
    try {
      console.log("Sending request to deleteKategori:", id);
      const response = await fetch(
        `${BASE_URL}/kategori/delete-kategori/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeader(),
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error("Error deleting kategori:", error);
      throw error;
    }
  },

  // Tingkatan
  getTingkatan: async () => {
    try {
      const response = await fetch(`${BASE_URL}/tingkatan/get-tingkatan`, {
        method: "GET",
        headers: getAuthHeader(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching tingkatan:", error);
      throw error;
    }
  },

  addTingkatan: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/tingkatan/add-tingkatan`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error adding tingkatan:", error);
      throw error;
    }
  },

  updateTingkatan: async (id, data) => {
    try {
      const response = await fetch(
        `${BASE_URL}/tingkatan/update-tingkatan/${id}`,
        {
          method: "PATCH",
          headers: getAuthHeader(),
          body: JSON.stringify(data),
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error("Error updating tingkatan:", error);
      throw error;
    }
  },

  deleteTingkatan: async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/tingkatan/delete-tingkatan/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeader(),
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error("Error deleting tingkatan:", error);
      throw error;
    }
  },

  // Pendidikan
  getPendidikan: async () => {
    try {
      const response = await fetch(`${BASE_URL}/pendidikan/get-pendidikan`, {
        method: "GET",
        headers: getAuthHeader(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching pendidikan:", error);
      throw error;
    }
  },

  addPendidikan: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/pendidikan/add-pendidikan`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error adding pendidikan:", error);
      throw error;
    }
  },

  updatePendidikan: async (id, data) => {
    try {
      const response = await fetch(
        `${BASE_URL}/pendidikan/update-pendidikan/${id}`,
        {
          method: "PATCH",
          headers: getAuthHeader(),
          body: JSON.stringify(data),
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error("Error updating pendidikan:", error);
      throw error;
    }
  },

  deletePendidikan: async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/pendidikan/delete-pendidikan/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeader(),
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error("Error deleting pendidikan:", error);
      throw error;
    }
  },

  // Kelas
  getKelas: async () => {
    try {
      const response = await fetch(`${BASE_URL}/kelas/get-kelas`, {
        method: "GET",
        headers: getAuthHeader(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching kelas:", error);
      throw error;
    }
  },

  getKelasById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/kelas/get-kelas/${id}`, {
        method: "GET",
        headers: getAuthHeader(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching kelas by id:", error);
      throw error;
    }
  },

  addKelas: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/kelas/add-kelas`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error adding kelas:", error);
      throw error;
    }
  },

  updateKelas: async (id, data) => {
    try {
      const response = await fetch(`${BASE_URL}/kelas/update-kelas/${id}`, {
        method: "PATCH",
        headers: getAuthHeader(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error updating kelas:", error);
      throw error;
    }
  },

  deleteKelas: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/kelas/delete-kelas/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error deleting kelas:", error);
      throw error;
    }
  },

  // Kuis
  getKuis: async () => {
    try {
      const response = await fetch(`${BASE_URL}/kuis/get-kuis`, {
        method: "GET",
        headers: getAuthHeader(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching kuis:", error);
      throw error;
    }
  },

  addKuis: async (data) => {
    try {
      const kuisData = {
        title: data.title,
        description: data.description,
        kategori_id: parseInt(data.kategori_id) || 0,
        tingkatan_id: parseInt(data.tingkatan_id) || 0,
        kelas_id: parseInt(data.kelas_id) || 0,
        pendidikan_id: parseInt(data.pendidikan_id) || 0,
      };
      console.log("Sending data to addKuis:", kuisData);

      const response = await fetch(`${BASE_URL}/kuis/add-kuis`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(kuisData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error adding kuis:", error);
      throw error;
    }
  },

  updateKuis: async (id, data) => {
    try {
      const kuisData = {
        title: data.title,
        description: data.description,
        kategori_id: parseInt(data.kategori_id) || 0,
        tingkatan_id: parseInt(data.tingkatan_id) || 0,
        kelas_id: parseInt(data.kelas_id) || 0,
        pendidikan_id: parseInt(data.pendidikan_id) || 0,
      };
      console.log("Sending data to updateKuis:", { id, data: kuisData });

      const response = await fetch(`${BASE_URL}/kuis/update-kuis/${id}`, {
        method: "PATCH",
        headers: getAuthHeader(),
        body: JSON.stringify(kuisData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error updating kuis:", error);
      throw error;
    }
  },

  deleteKuis: async (id) => {
    try {
      console.log("Sending request to deleteKuis:", id);
      const response = await fetch(`${BASE_URL}/kuis/delete-kuis/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error deleting kuis:", error);
      throw error;
    }
  },

  // Soal
  getSoal: async () => {
    try {
      const response = await fetch(`${BASE_URL}/soal/get-soal`, {
        method: "GET",
        headers: getAuthHeader(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching soal:", error);
      throw error;
    }
  },

  getSoalByKuisID: async (kuisId) => {
    try {
      const response = await fetch(`${BASE_URL}/soal/get-soal/${kuisId}`, {
        method: "GET",
        headers: getAuthHeader(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching soal by kuis ID:", error);
      throw error;
    }
  },

  addSoal: async (data) => {
    try {
      const soalData = {
        question: data.question,
        options_json: data.options_json || JSON.stringify(data.options),
        correct_answer: data.correct_answer,
        kuis_id: parseInt(data.kuis_id),
      };
      console.log("Sending data to addSoal:", soalData);

      const response = await fetch(`${BASE_URL}/soal/add-soal`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(soalData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error adding soal:", error);
      throw error;
    }
  },

  updateSoal: async (id, data) => {
    try {
      const soalData = {
        question: data.question,
        options_json: JSON.stringify(data.options),
        correct_answer: data.correct_answer,
        kuis_id: parseInt(data.kuis_id),
      };
      console.log("Sending data to updateSoal:", soalData);

      const response = await fetch(`${BASE_URL}/soal/update-soal/${id}`, {
        method: "PATCH",
        headers: getAuthHeader(),
        body: JSON.stringify(soalData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error in updateSoal:", error);
      throw error;
    }
  },

  deleteSoal: async (id) => {
    try {
      console.log("Sending request to deleteSoal:", id);
      const response = await fetch(`${BASE_URL}/soal/delete-soal/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error deleting soal:", error);
      throw error;
    }
  },

  // Hasil Kuis
  submitJawaban: async (kuisId, answers) => {
    try {
      const formattedAnswers = answers.map((answer) => ({
        soal_id: parseInt(answer.soal_id),
        selected_answer: answer.selected_answer,
      }));

      console.log("Mengirim jawaban:", {
        kuis_id: parseInt(kuisId),
        answers: formattedAnswers,
      });

      const response = await fetch(`${BASE_URL}/hasil-kuis/submit-jawaban`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({
          kuis_id: parseInt(kuisId),
          answers: formattedAnswers,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Gagal mengirim jawaban");
      }
      return data;
    } catch (error) {
      console.error("Error dalam submitJawaban:", error);
      throw error;
    }
  },
};
>>>>>>> 2ef6045f5a78e89e8b56c0a3496f8360cddd6496
