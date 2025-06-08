# Role Testing Guide

## Issue Found
Admin login menampilkan akses sebagai siswa instead of admin.

## Root Cause Analysis - FOUND THE REAL ISSUE! 🎯
1. **KEY MISMATCH**: `roleUtils.js` mencari `localStorage.getItem('role')` tapi `useAuth` menyimpan sebagai `localStorage.getItem('userRole')`
2. **MULTIPLE ROLE SYSTEMS**: Ada 2 sistem role yang berbeda:
   - `useAuth` hook menggunakan key `userRole`
   - `roleUtils.js` menggunakan key `role`
   - `RoleGuard.jsx` dan `SideNavbar.jsx` menggunakan `roleUtils.js`
3. **FALLBACK CONFLICTS**: Fallback values di berbagai tempat menimpa role admin
4. **JWT token** tidak menyimpan role, hanya user_id

## Fixes Applied - COMPREHENSIVE SOLUTION! 🔧

### 1. **Fixed Key Mismatch Issue**
- Updated `roleUtils.js` to use `userRole` key instead of `role`
- Added backward compatibility for old `role` key
- Added migration logic to move from old to new key

### 2. **Unified Role System**
- Updated `RoleGuard.jsx` to use `useAuth` hook instead of `roleUtils`
- Updated `SideNavbar.jsx` to use `useAuth` hook instead of `roleUtils`
- All components now use consistent role system

### 3. **Updated useAuth Hook**
- Removed automatic fallback to 'user' role
- Added comprehensive console logging for debugging
- Fixed getUserInfo() to preserve stored role
- Changed default from 'user' to 'student'

### 4. **Added Debug Components**
- `DebugInfo.jsx` - Shows all auth state in development
- Updated `RoleIndicator.jsx` - Shows current role with debug info
- `RoleDisplay.jsx` - New component for role display

### 5. **Added Debug Logging**
- Login function logs userData and role
- getUserInfo logs stored values
- RoleIndicator logs current role state
- roleUtils logs role retrieval process

## Test Credentials

### Admin User:
```
Email: admin@test.com
Password: admin123
Role: admin
User ID: 24
```

### Student User:
```
Email: test@test.com
Password: test123
Role: student
User ID: 23
```

## Testing Steps

### 1. **Clear Previous Data**
```javascript
// In browser console:
localStorage.clear();
location.reload();
```

### 2. **Test Admin Login**
1. Go to `http://localhost:5173`
2. Login with admin credentials
3. Check debug info (bottom right corner)
4. Verify role indicator shows "Administrator 👑"
5. Check console logs for role values

### 3. **Test Student Login**
1. Logout and clear localStorage
2. Login with student credentials
3. Check debug info shows "student" role
4. Verify role indicator shows "Siswa 👨‍🎓"

### 4. **Verify Role Functions**
Check in browser console:
```javascript
// Should return true for admin
window.localStorage.getItem('userRole') === 'admin'

// Check role functions (if available in global scope)
// isAdmin() should return true for admin user
// isStudent() should return false for admin user
```

## Expected Behavior

### Admin Login Should Show:
- **Role**: "admin"
- **Role Indicator**: "Administrator 👑" with red background
- **Debug Info**: userRole: "admin", isAdmin: true
- **Console Logs**: "Setting userRole to: admin"

### Student Login Should Show:
- **Role**: "student" 
- **Role Indicator**: "Siswa 👨‍🎓" with green background
- **Debug Info**: userRole: "student", isStudent: true
- **Console Logs**: "Setting userRole to: student"

## Debug Information

### Check localStorage:
```javascript
console.log({
  token: localStorage.getItem('token'),
  userId: localStorage.getItem('userId'),
  userName: localStorage.getItem('userName'),
  userRole: localStorage.getItem('userRole')
});
```

### Check JWT Token:
```javascript
const token = localStorage.getItem('token');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('JWT Payload:', payload);
}
```

## Troubleshooting

### If Role Still Shows Wrong:
1. **Clear localStorage completely**
2. **Check console logs** for role setting
3. **Verify backend response** includes correct role
4. **Check debug component** for stored values

### If Debug Component Not Showing:
- Make sure you're in development mode
- Check browser console for errors
- Verify component is imported in App.jsx

### If Role Functions Not Working:
- Check useRole hook is being used correctly
- Verify role comparison logic
- Check for typos in role names ('admin' vs 'Admin')

## Backend Verification

### Test Backend Response:
```bash
# Test admin login
curl -X POST http://localhost:8000/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}' \
  | jq .

# Should return:
# {
#   "data": {
#     "name": "Admin User",
#     "role": "admin",  <-- This should be "admin"
#     "token": "...",
#     "user_id": 24
#   },
#   "message": "Login successful",
#   "success": true
# }
```

## Success Criteria

✅ Admin login shows "Administrator 👑" role indicator
✅ Debug info shows userRole: "admin"
✅ isAdmin() returns true for admin user
✅ Console logs show correct role being set
✅ localStorage contains correct role value
✅ Role persists after page refresh

## Notes

- Debug components only show in development mode
- Console logs help track role flow through the application
- Role checking functions (isAdmin, isTeacher, isStudent) should work correctly
- Role should persist in localStorage and survive page refreshes

---

## QUIZ OPTIONS ISSUE FOUND & FIXED! 🎯

### New Issue: Quiz Options Not Displaying
**Problem:** "Pilihan jawaban tidak tersedia" muncul meskipun data options ada di backend.

### Root Cause:
Backend mengirim options dalam format:
```json
{
  "A": "6",
  "B": "7",
  "C": "8",
  "D": "9"
}
```

Tapi `parseOptions` function di `QuizQuestion.jsx` tidak menangani format alphabetic keys (A, B, C, D).

### Solution Applied:
1. **Updated parseOptions function** - Menambahkan handling untuk alphabetic keys
2. **Added comprehensive logging** - Untuk debugging parsing process
3. **Updated option rendering** - Menangani format object dengan key/value/label
4. **Added test component** - `/test-options` untuk debugging

### Test URLs:
- **Options Test**: `http://localhost:5173/test-options`
- **Actual Quiz**: `http://localhost:5173/ambil-kuis`

### Expected Result:
Options sekarang harus muncul sebagai:
- A. 6
- B. 7
- C. 8
- D. 9
