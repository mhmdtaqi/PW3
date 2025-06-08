# Frontend Reorganization Documentation

## Overview
Proyek frontend telah direorganisasi untuk meningkatkan maintainability, reusability, dan struktur kode yang lebih baik.

## Struktur Folder Baru

```
src/
├── components/
│   ├── common/              # Komponen umum yang dapat digunakan di seluruh aplikasi
│   │   ├── Loading.jsx      # Komponen loading dengan berbagai varian
│   │   └── ErrorBoundary.jsx # Error boundary untuk menangani error
│   ├── forms/               # Komponen form khusus
│   ├── quiz/                # Komponen khusus untuk quiz
│   │   ├── QuizTimer.jsx    # Timer untuk quiz
│   │   ├── QuizProgress.jsx # Progress bar dan navigasi soal
│   │   ├── QuizQuestion.jsx # Tampilan soal dan pilihan jawaban
│   │   ├── QuizNavigation.jsx # Navigasi antar soal
│   │   └── QuizResult.jsx   # Tampilan hasil quiz
│   ├── layout/              # Komponen layout
│   └── ui/                  # Komponen UI dasar (Button, Input, dll)
├── pages/
│   ├── auth/                # Halaman authentication
│   │   ├── LoginPage.jsx    # Halaman login (sudah direfactor)
│   │   └── SignupPage.jsx   # Halaman signup
│   ├── quiz/                # Halaman quiz
│   │   └── JawabKuisPage.jsx # Halaman mengerjakan quiz (sudah direfactor)
│   ├── admin/               # Halaman admin
│   ├── dashboard/           # Halaman dashboard
│   └── profile/             # Halaman profil
├── hooks/                   # Custom hooks
│   ├── useAuth.js           # Hook untuk authentication dan user management
│   └── useTimer.js          # Hook untuk timer functionality
├── services/                # API services
│   ├── api.js               # Service API yang sudah ada
│   └── quizApi.js           # Service API baru yang terstruktur
├── utils/                   # Utility functions
├── constants/               # Konstanta
│   └── api.js               # Konstanta API endpoints dan konfigurasi
└── types/                   # Type definitions (untuk future TypeScript migration)
```

## Perubahan Utama

### 1. **Pemisahan Komponen Quiz**
File `JawabKuisPage.jsx` yang sebelumnya 512 baris telah dipecah menjadi:
- `QuizTimer.jsx` - Menangani timer dan status waktu
- `QuizProgress.jsx` - Progress bar dan navigasi soal
- `QuizQuestion.jsx` - Tampilan soal dan parsing options
- `QuizNavigation.jsx` - Navigasi antar soal
- `QuizResult.jsx` - Tampilan hasil quiz

### 2. **Custom Hooks**
- `useAuth.js` - Menangani authentication, user info, dan role management
- `useTimer.js` - Menangani timer functionality dengan auto-submit

### 3. **API Services Terstruktur**
- `constants/api.js` - Semua endpoint dan konfigurasi API
- `services/quizApi.js` - API calls yang terstruktur dengan error handling

### 4. **Error Handling**
- `ErrorBoundary.jsx` - Menangani error di level aplikasi
- `ErrorMessage.jsx` - Komponen untuk menampilkan error
- Integrated error handling di semua API calls

### 5. **Loading States**
- `Loading.jsx` - Komponen loading dengan berbagai varian
- `SkeletonLoader.jsx` - Skeleton loading untuk better UX
- `ButtonLoading.jsx` - Loading state untuk button

## Benefits

### 1. **Maintainability**
- Kode lebih mudah dipelihara karena terpisah berdasarkan fungsi
- Setiap komponen memiliki tanggung jawab yang jelas
- Easier debugging dan testing

### 2. **Reusability**
- Komponen dapat digunakan kembali di halaman lain
- Custom hooks dapat digunakan di berbagai komponen
- API services dapat digunakan di seluruh aplikasi

### 3. **Performance**
- Lazy loading dapat diterapkan lebih mudah
- Bundle splitting lebih optimal
- Better code splitting

### 4. **Developer Experience**
- Struktur folder yang intuitif
- Easier navigation dalam codebase
- Better IntelliSense dan autocomplete

## Migration Guide

### Untuk File yang Belum Direfactor:
1. Identifikasi komponen yang dapat dipecah
2. Extract logic ke custom hooks jika memungkinkan
3. Gunakan API services yang sudah ada
4. Implement error handling dan loading states

### Contoh Refactoring:
```jsx
// Before (dalam satu file besar)
const LargePage = () => {
  // 500+ lines of code
}

// After (dipecah menjadi beberapa komponen)
const LargePage = () => {
  return (
    <div>
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
}
```

## Next Steps

1. **Refactor halaman-halaman besar lainnya:**
   - AchievementsPage.jsx (898 baris)
   - StudyPlannerPage.jsx (759 baris)
   - KuisPage.jsx (698 baris)
   - DetailKelas.jsx (681 baris)
   - DashboardPage.jsx (602 baris)

2. **Implement TypeScript** untuk better type safety

3. **Add unit tests** untuk komponen dan hooks

4. **Implement lazy loading** untuk better performance

5. **Add Storybook** untuk component documentation

## File yang Sudah Direfactor

✅ `JawabKuisPage.jsx` - Dipecah menjadi komponen-komponen kecil
✅ `LoginPage.jsx` - Menggunakan useAuth hook dan API service
✅ Error Boundary - Implemented di level aplikasi
✅ Loading Components - Reusable loading states
✅ API Services - Terstruktur dan consistent

## File yang Perlu Direfactor

❌ AchievementsPage.jsx (898 baris)
❌ StudyPlannerPage.jsx (759 baris)
❌ KuisPage.jsx (698 baris)
❌ DetailKelas.jsx (681 baris)
❌ DashboardPage.jsx (602 baris)
❌ ManageSoalPage.jsx (480 baris)
❌ HasilKuisPage.jsx (416 baris)
❌ AmbilKuisPage.jsx (412 baris)
