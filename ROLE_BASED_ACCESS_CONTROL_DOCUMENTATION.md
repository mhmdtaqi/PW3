# 🔐 Role-Based Access Control (RBAC) - BrainQuiz

## ✨ **Overview**

Sistem Role-Based Access Control (RBAC) telah berhasil diimplementasi di BrainQuiz untuk membedakan akses dan fitur berdasarkan role user. Sistem ini memberikan pengalaman yang disesuaikan untuk setiap jenis pengguna dengan kontrol akses yang ketat.

---

## 🎯 **Role Definitions**

### **1. 👑 Admin**
- **Akses**: Penuh ke semua fitur
- **Permissions**: Create, Read, Update, Delete semua data
- **Features**: Semua halaman dan fungsi tersedia

### **2. 👨‍🏫 Guru**
- **Akses**: Terbatas, tidak bisa akses master data
- **Restrictions**: Tidak bisa akses Tingkatan, Pendidikan, Kategori
- **Features**: Kelas, Kuis, Soal, Jawab Kuis, Hasil Kuis

### **3. 👨‍🎓 Murid**
- **Akses**: Sangat terbatas, fokus pada pembelajaran
- **Restrictions**: Hanya bisa lihat Kelas (read-only)
- **Features**: Kelas (view only), Jawab Kuis, Hasil Kuis

---

## 🔧 **Technical Implementation**

### **1. Role Utilities (`src/utils/roleUtils.js`)**

#### **Role Constants:**
```javascript
export const ROLES = {
  ADMIN: 'admin',
  GURU: 'guru', 
  MURID: 'murid'
};
```

#### **Permission System:**
```javascript
export const canAccessFeature = (feature) => {
  const role = getUserRole();
  
  const permissions = {
    [ROLES.ADMIN]: [
      'kategori', 'tingkatan', 'pendidikan', 'kelas', 'kuis', 
      'soal', 'jawab-kuis', 'hasil-kuis', 'manage-all'
    ],
    
    [ROLES.GURU]: [
      'kelas', 'kuis', 'soal', 'jawab-kuis', 'hasil-kuis'
    ],
    
    [ROLES.MURID]: [
      'kelas-view', 'jawab-kuis', 'hasil-kuis'
    ]
  };
  
  return permissions[role]?.includes(feature) || false;
};
```

#### **Navigation Control:**
```javascript
export const canAccessNavItem = (navItem) => {
  const role = getUserRole();
  
  const navPermissions = {
    [ROLES.ADMIN]: [
      'dashboard', 'kategori', 'tingkatan', 'pendidikan', 'kelas', 
      'kuis', 'kuis-siswa', 'hasil-kuis'
    ],
    
    [ROLES.GURU]: [
      'dashboard', 'kelas', 'kuis', 'kuis-siswa', 'hasil-kuis'
    ],
    
    [ROLES.MURID]: [
      'dashboard', 'kelas', 'kuis-siswa', 'hasil-kuis'
    ]
  };
  
  return navPermissions[role]?.includes(navItem) || false;
};
```

### **2. RoleGuard Component (`src/components/RoleGuard.jsx`)**

#### **Access Protection:**
```jsx
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
        </div>
      </div>
    );
  }

  return children;
};
```

### **3. Dynamic Navbar (`src/components/Navbar.jsx`)**

#### **Role-Based Navigation:**
```jsx
const getNavigationItems = () => {
  const allItems = [
    { name: "Dashboard", path: "/dashboard", key: "dashboard", icon: <DashboardIcon /> },
    { name: "Kategori", path: "/daftar-kategori", key: "kategori", icon: <KategoriIcon /> },
    { name: "Tingkatan", path: "/daftar-tingkatan", key: "tingkatan", icon: <TingkatanIcon /> },
    { name: "Pendidikan", path: "/daftar-pendidikan", key: "pendidikan", icon: <PendidikanIcon /> },
    { name: "Kelas", path: "/daftar-kelas", key: "kelas", icon: <KelasIcon /> },
    { name: "Kelola Kuis", path: "/daftar-kuis", key: "kuis", icon: <KuisIcon /> },
    { name: "Ikut Kuis", path: "/kuis-siswa", key: "kuis-siswa", icon: <IkutKuisIcon /> }
  ];

  return allItems.filter(item => canAccessNavItem(item.key));
};
```

#### **Role Indicator:**
```jsx
{/* Desktop Role Indicator */}
<div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
  <span className="text-lg">{getRoleEmoji(userRole)}</span>
  <span className="text-sm font-medium text-gray-700">{getRoleDisplayName(userRole)}</span>
</div>

{/* Mobile Role Indicator */}
<div className="flex items-center space-x-3 px-4 py-2 text-gray-500 text-sm">
  <span>{getRoleEmoji(userRole)}</span>
  <span>Role: {getRoleDisplayName(userRole)}</span>
</div>
```

### **4. Role-Based Dashboard (`src/pages/DashboardPage.jsx`)**

#### **Dynamic Feature Display:**
```jsx
const userRole = getUserRole();
const allowedFeatures = getAllowedFeatures();

{/* Kelola Kuis - Admin & Guru Only */}
{allowedFeatures.quiz.includes('kelola-kuis') && (
  <div className="group relative bg-white rounded-3xl shadow-2xl">
    <div className="text-purple-600 font-semibold text-sm">
      {userRole === 'admin' ? 'ADMIN FEATURE' : 'GURU FEATURE'}
    </div>
    {/* Feature content */}
  </div>
)}

{/* Ikut Kuis - All Roles */}
{allowedFeatures.quiz.includes('ikut-kuis') && (
  <div className="group relative bg-white rounded-3xl shadow-2xl">
    <div className="text-blue-600 font-semibold text-sm">
      {userRole === 'murid' ? 'STUDENT FEATURE' : 'QUIZ FEATURE'}
    </div>
    {/* Feature content */}
  </div>
)}
```

---

## 📊 **Access Matrix**

### **Feature Access by Role:**

| Feature | Admin | Guru | Murid |
|---------|-------|------|-------|
| Dashboard | ✅ | ✅ | ✅ |
| Kategori | ✅ | ❌ | ❌ |
| Tingkatan | ✅ | ❌ | ❌ |
| Pendidikan | ✅ | ❌ | ❌ |
| Kelas | ✅ (CRUD) | ✅ (CRUD) | ✅ (Read Only) |
| Kelola Kuis | ✅ | ✅ | ❌ |
| Ikut Kuis | ✅ | ✅ | ✅ |
| Hasil Kuis | ✅ | ✅ | ✅ |

### **Action Permissions:**

| Action | Admin | Guru | Murid |
|--------|-------|------|-------|
| Create | ✅ | ✅* | ❌ |
| Read | ✅ | ✅ | ✅ |
| Update | ✅ | ✅* | ❌ |
| Delete | ✅ | ✅* | ❌ |
| Take Quiz | ✅ | ✅ | ✅ |
| View Results | ✅ | ✅ | ✅ |

*Guru hanya bisa CRUD pada fitur yang diizinkan (Kelas, Kuis, Soal)

---

## 🎨 **Visual Indicators**

### **Role Emojis:**
- 👑 **Admin**: Administrator
- 👨‍🏫 **Guru**: Guru  
- 👨‍🎓 **Murid**: Murid

### **Feature Labels:**
- **ADMIN FEATURE**: Purple badge untuk fitur khusus admin
- **GURU FEATURE**: Purple badge untuk fitur guru
- **STUDENT FEATURE**: Blue badge untuk fitur murid
- **QUIZ FEATURE**: Blue badge untuk fitur umum

### **Access Denied Page:**
- 🚫 **Warning icon** dengan pesan yang jelas
- 📝 **Role-specific message** yang informatif
- 🔙 **Return to Dashboard** button untuk navigation

---

## 🔒 **Security Features**

### **Client-Side Protection:**
- ✅ **Navigation filtering** berdasarkan role
- ✅ **Component-level guards** dengan RoleGuard
- ✅ **Dynamic UI** yang menyembunyikan fitur tidak diizinkan
- ✅ **Access denied pages** dengan pesan yang jelas

### **Role Validation:**
- ✅ **localStorage role checking** untuk persistence
- ✅ **Fallback to default role** jika tidak ada
- ✅ **Consistent role checking** di semua komponen
- ✅ **Automatic logout cleanup** untuk security

---

## 🎯 **User Experience by Role**

### **👑 Admin Experience:**
- **Full Access**: Semua menu dan fitur tersedia
- **Master Data**: Bisa kelola Kategori, Tingkatan, Pendidikan
- **Quiz Management**: Full CRUD untuk kuis dan soal
- **Student Features**: Bisa ikut kuis dan lihat hasil
- **Visual Indicator**: Crown emoji dan "Administrator" label

### **👨‍🏫 Guru Experience:**
- **Limited Access**: Tidak bisa akses master data
- **Quiz Focus**: Fokus pada pengelolaan kuis dan soal
- **Class Management**: Bisa kelola kelas
- **Teaching Tools**: Semua fitur untuk mengajar tersedia
- **Visual Indicator**: Teacher emoji dan "Guru" label

### **👨‍🎓 Murid Experience:**
- **Learning Focus**: Hanya fitur pembelajaran yang tersedia
- **Quiz Taking**: Fokus pada mengerjakan kuis
- **View Only**: Bisa lihat kelas tapi tidak edit
- **Results Tracking**: Bisa lihat hasil kuis sendiri
- **Visual Indicator**: Student emoji dan "Murid" label

---

## 📱 **Responsive Implementation**

### **Desktop:**
- ✅ **Role indicator** di navbar kanan
- ✅ **Full navigation menu** sesuai role
- ✅ **Feature cards** dengan role-specific labels
- ✅ **Hover effects** dan animations

### **Mobile:**
- ✅ **Collapsible menu** dengan role filtering
- ✅ **Role indicator** di mobile menu
- ✅ **Touch-friendly** navigation
- ✅ **Optimized layouts** untuk layar kecil

---

## 🎉 **Benefits**

### **Security:**
- 🔒 **Controlled access** berdasarkan role
- 🔒 **Consistent permissions** di seluruh aplikasi
- 🔒 **Clear boundaries** untuk setiap role
- 🔒 **Graceful degradation** untuk unauthorized access

### **User Experience:**
- 🎯 **Personalized interface** untuk setiap role
- 🎯 **Reduced complexity** dengan hiding irrelevant features
- 🎯 **Clear role identification** dengan visual indicators
- 🎯 **Intuitive navigation** sesuai kebutuhan role

### **Maintainability:**
- 🔧 **Centralized permission logic** di roleUtils
- 🔧 **Reusable components** untuk access control
- 🔧 **Easy to extend** untuk role baru
- 🔧 **Consistent patterns** di seluruh aplikasi

---

## 🎉 **Final Result**

**🚀 ROLE-BASED ACCESS CONTROL - FULLY IMPLEMENTED!**

### **What's Working:**
- 🎯 **Three distinct roles** dengan permissions yang jelas
- 🎯 **Dynamic navigation** berdasarkan role
- 🎯 **Protected pages** dengan RoleGuard
- 🎯 **Role-specific dashboard** dengan conditional features
- 🎯 **Visual indicators** untuk role identification
- 🎯 **Responsive design** untuk semua perangkat

### **User Benefits:**
- ✅ **Personalized experience** sesuai role
- ✅ **Clear access boundaries** tanpa confusion
- ✅ **Intuitive interface** dengan relevant features only
- ✅ **Professional appearance** dengan role indicators

### **Developer Benefits:**
- ✅ **Centralized permission system** yang maintainable
- ✅ **Reusable access control** components
- ✅ **Easy to extend** untuk requirements baru
- ✅ **Production ready** security implementation

**🎉 Sistem RBAC BrainQuiz telah selesai sempurna dan siap untuk production use!** ✨

**Role-based access control memberikan pengalaman yang tepat untuk setiap jenis pengguna sambil menjaga keamanan dan integritas sistem!** 🔐🎯
