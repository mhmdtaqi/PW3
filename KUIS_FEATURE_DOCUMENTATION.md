# 🎯 Dokumentasi Fitur Kuis - BrainQuiz

## ✨ **Overview**

Fitur Kuis yang baru telah berhasil dibuat dengan design modern dan fungsionalitas lengkap. Fitur ini memungkinkan pengguna untuk mengelola kuis pembelajaran dengan berbagai kategori, tingkatan, pendidikan, dan kelas, serta membuat soal-soal untuk setiap kuis.

---

## 🎯 **Fitur Utama**

### **1. 📋 Halaman Daftar Kuis**
- **URL**: `/daftar-kuis`
- **Fungsi**: Mengelola semua kuis pembelajaran
- **Features**:
  - ✅ Card-based layout dengan design modern
  - ✅ Form tambah/edit dengan 4 dropdown terintegrasi
  - ✅ Navigasi ke halaman buat soal
  - ✅ CRUD operations (Create, Read, Update, Delete)

### **2. 📝 Halaman Buat Soal**
- **URL**: `/kuis/{kuisId}/soal`
- **Fungsi**: Mengelola soal-soal untuk kuis tertentu
- **Features**:
  - ✅ Form untuk membuat soal dengan 4 pilihan jawaban
  - ✅ Penentuan jawaban benar
  - ✅ Visual display soal dengan highlight jawaban benar
  - ✅ CRUD operations untuk soal

---

## 🎨 **Design Features**

### **Visual Design:**
- ✅ **Purple to Pink gradient** untuk tema kuis
- ✅ **Emerald to Teal gradient** untuk tema soal
- ✅ **Modern card layouts** dengan hover animations
- ✅ **Responsive design** untuk semua perangkat
- ✅ **Consistent styling** dengan halaman lainnya

### **Interactive Elements:**
- ✅ **Smooth animations** dan transitions
- ✅ **Hover effects** pada cards dan buttons
- ✅ **Loading states** dan error handling
- ✅ **Form validation** dengan feedback visual

---

## 🔧 **Technical Implementation**

### **1. Halaman Daftar Kuis (`daftarKuis.jsx`)**

#### **State Management:**
```jsx
// Data states
const [data, setData] = useState([]);
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

// Dropdown data states
const [tingkatanList, setTingkatanList] = useState([]);
const [kategoriList, setKategoriList] = useState([]);
const [pendidikanList, setPendidikanList] = useState([]);
const [kelasList, setKelasList] = useState([]);

// Form state
const [formData, setFormData] = useState({
  title: "",
  description: "",
  tingkatan_id: "",
  kategori_id: "",
  pendidikan_id: "",
  kelas_id: ""
});
```

#### **API Integration:**
```jsx
// Fetch kuis data
const fetchKuisData = useCallback(async () => {
  const response = await fetch("/kuis/get-kuis");
  // Handle response...
}, [navigate]);

// Fetch dropdown data
const fetchDropdownData = async () => {
  const [tingkatanRes, kategoriRes, pendidikanRes, kelasRes] = 
    await Promise.all([
      fetch("/tingkatan/get-tingkatan"),
      fetch("/kategori/get-kategori"),
      fetch("/pendidikan/get-pendidikan"),
      fetch("/kelas/get-kelas")
    ]);
  // Process responses...
};
```

#### **Form Handling:**
```jsx
// Add new kuis
const handleAdd = async (e) => {
  e.preventDefault();
  const response = await api.addKuis(formData);
  // Handle success/error...
};

// Edit existing kuis
const handleEdit = async (e) => {
  e.preventDefault();
  const response = await api.updateKuis(editingItem.id, formData);
  // Handle success/error...
};
```

### **2. Halaman Buat Soal (`buatSoal.jsx`)**

#### **State Management:**
```jsx
// Form state for soal
const [formData, setFormData] = useState({
  question: "",
  options: {
    A: "",
    B: "",
    C: "",
    D: ""
  },
  correct_answer: ""
});

// Soal list and kuis info
const [soalList, setSoalList] = useState([]);
const [kuisInfo, setKuisInfo] = useState(null);
```

#### **Options Handling:**
```jsx
// Handle option input changes
const handleInputChange = (e) => {
  const { name, value } = e.target;
  if (name.startsWith('option_')) {
    const optionKey = name.split('_')[1];
    setFormData(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [optionKey]: value
      }
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }
};
```

---

## 🗂️ **Database Structure**

### **Tabel Kuis:**
```sql
- id (Primary Key)
- title (VARCHAR)
- description (TEXT)
- tingkatan_id (Foreign Key)
- kategori_id (Foreign Key)
- pendidikan_id (Foreign Key)
- kelas_id (Foreign Key)
- created_at
- updated_at
```

### **Tabel Soal:**
```sql
- id (Primary Key)
- kuis_id (Foreign Key)
- question (TEXT)
- options (JSON)
- correct_answer (VARCHAR)
- created_at
- updated_at
```

---

## 🚀 **API Endpoints**

### **Kuis Endpoints:**
```javascript
// Get all kuis
GET /kuis/get-kuis

// Add new kuis
POST /kuis/add-kuis
Body: {
  title: string,
  description: string,
  tingkatan_id: number,
  kategori_id: number,
  pendidikan_id: number,
  kelas_id: number
}

// Update kuis
PUT /kuis/update-kuis/:id
Body: { same as add }

// Delete kuis
DELETE /kuis/delete-kuis/:id
```

### **Soal Endpoints:**
```javascript
// Get soal by kuis ID
GET /soal/get-soal-by-kuis/:kuisId

// Add new soal
POST /soal/add-soal
Body: {
  question: string,
  options: {
    A: string,
    B: string,
    C: string,
    D: string
  },
  correct_answer: string,
  kuis_id: number
}

// Update soal
PUT /soal/update-soal/:id
Body: { same as add }

// Delete soal
DELETE /soal/delete-soal/:id
```

---

## 🎯 **User Flow**

### **Membuat Kuis Baru:**
1. User mengakses `/daftar-kuis`
2. Klik tombol "Tambah Kuis"
3. Isi form dengan:
   - Judul kuis
   - Deskripsi kuis
   - Pilih tingkatan dari dropdown
   - Pilih kategori dari dropdown
   - Pilih pendidikan dari dropdown
   - Pilih kelas dari dropdown
4. Klik "Simpan Kuis"
5. Kuis baru muncul di daftar

### **Membuat Soal untuk Kuis:**
1. Dari daftar kuis, klik tombol "Buat Soal"
2. Navigasi ke `/kuis/{kuisId}/soal`
3. Klik tombol "Tambah Soal"
4. Isi form dengan:
   - Pertanyaan soal
   - 4 pilihan jawaban (A, B, C, D)
   - Pilih jawaban yang benar
5. Klik "Simpan Soal"
6. Soal baru muncul di daftar dengan visual highlight

---

## 📱 **Responsive Design**

### **Mobile (< 768px):**
- Single column layout untuk cards
- Stack form inputs vertically
- Touch-friendly buttons
- Optimized spacing

### **Tablet (768px - 1024px):**
- Two column layout untuk cards
- Grid layout untuk form inputs
- Medium spacing

### **Desktop (> 1024px):**
- Three column layout untuk cards
- Full grid layout dengan hover effects
- Maximum spacing dan visual effects

---

## 🎨 **Color Scheme**

### **Kuis Theme:**
- **Primary**: Purple to Pink gradient (`from-purple-500 to-pink-600`)
- **Hover**: Purple to Pink dark (`from-purple-600 to-pink-700`)
- **Accent**: Purple variants untuk buttons dan highlights

### **Soal Theme:**
- **Primary**: Emerald to Teal gradient (`from-emerald-500 to-teal-600`)
- **Hover**: Emerald to Teal dark (`from-emerald-600 to-teal-700`)
- **Accent**: Emerald variants untuk correct answers

---

## ✅ **Features Completed**

### **✅ Daftar Kuis:**
- Modern card-based layout
- Form dengan 4 dropdown terintegrasi
- CRUD operations lengkap
- Error handling dan loading states
- Responsive design
- Smooth animations

### **✅ Buat Soal:**
- Form untuk membuat soal dengan options
- Visual display soal dengan highlight
- CRUD operations untuk soal
- Navigation antar halaman
- Consistent design dengan halaman lain

### **✅ Integration:**
- Routing terintegrasi di App.jsx
- Navigation links di Navbar
- Card di Dashboard
- API integration lengkap
- Error handling menyeluruh

---

## 🚀 **Next Steps (Optional)**

Untuk pengembangan lebih lanjut:

1. **Quiz Taking Interface** - Interface untuk siswa mengerjakan kuis
2. **Results & Analytics** - Sistem penilaian dan analitik
3. **Timer Functionality** - Waktu pengerjaan kuis
4. **Question Types** - Jenis soal yang lebih beragam
5. **Bulk Import** - Import soal dari file Excel/CSV

---

## 🎉 **Summary**

Fitur Kuis telah berhasil diimplementasi dengan:
- ✅ **Modern design** yang konsisten
- ✅ **Full CRUD functionality** untuk kuis dan soal
- ✅ **Responsive design** untuk semua perangkat
- ✅ **Smooth user experience** dengan animations
- ✅ **Robust error handling** dan validation
- ✅ **Clean code structure** yang maintainable

**Fitur ini siap digunakan dan terintegrasi penuh dengan aplikasi BrainQuiz!** 🎯✨
