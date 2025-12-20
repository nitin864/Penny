# 💸 Expense Tracker App

 
  
A modern **Expense Tracker mobile application** built using **React Native & Expo**, designed to manage wallets, track transactions, and provide spending insights with a clean and smooth dark UI.

---

## 📱 App Overview

This app helps users:
- Manage multiple wallets
- Track income & expenses
- Upload wallet and transaction icons
- View and update profile
- Explore an Insights page for detail view of your expenses and income in yearly, weekly or monthly view using graphs. 

---

## ✨ Features

### 💼 Wallet Management
- Create new wallets (Cash, Salary, Savings, etc.)
- Update wallet name and icon
- Delete wallets
- View all wallets in one place
- Track wallet balances

### 💳 Transactions
- Add new transactions (Expense / Income)
- Select wallet for each transaction
- Upload transaction icons
- Edit & delete transactions
- Date-based transaction tracking

### 📊 Insights 
- Insights screen UI integrated
- Planned features:
  - Spending analytics
  - Category-wise charts
  - Monthly summaries
  - Visual reports

### 👤 Profile & Settings
- View profile details
- Update name & profile picture
- Edit profile
- Logout functionality
- Privacy policy section

### 🎨 UI / UX
- Dark theme UI
- Smooth animations
- Reusable components
- Bottom tab navigation
- Clean typography & spacing

---

## 🛠️ Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development framework
- **TypeScript** - Type-safe code
- **Firebase** - Auth, Firestore, Storage
- **Expo Router** - Navigation
- **React Native Reanimated** - Smooth animations
- **react-native-element-dropdown** - Dropdown components
- **Phosphor Icons** - Icon library

---

## 📂 Project Structure

```
src/
├── components/       # Reusable UI components
├── constants/        # Theme, colors, spacing
├── context/          # Authentication & global state
├── services/         # Firebase & API services
├── screens/          # Wallet, Transactions, Profile, Insights
├── utils/            # Utility helpers
└── types/            # TypeScript types
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/nitin864/Penny
cd Penny
```

### 2️⃣ Install Dependencies
```bash
npm install
# or
yarn install
```

### 3️⃣ Start the Development Server
```bash
npm start
```

### 4️⃣ Run the App
You can run the app on:
- 📱 Android Emulator
- 🍎 iOS Simulator
- 📲 Physical device using Expo Go

---

## 🔐 Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable the following services:
   - Authentication
   - Firestore Database
   - Storage (for image uploads)
3. Add your Firebase config to the project files
4.setup Cloudinary for Image Storage
---

## 🎯 Future Improvements

- Interactive charts & analytics
- Monthly & yearly expense reports
- Offline mode
- Budget limits & alerts
- Dark / Light theme toggle
- Cloud sync optimization

---

## 👨‍💻 Developer

**Nitin Raj**  
 
GitHub: [@nitin864](https://github.com/nitin864)

---

## ⭐ Support

If you like this project, please consider giving it a ⭐ star on GitHub. Your support motivates further development! 🚀

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Made with ❤️ by Nitin Raj**
