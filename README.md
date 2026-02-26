# CivicPulse: Smart City Info Portal

A comprehensive, enterprise-grade Smart City Information Portal built with React, Node.js, and SQLite.

## 🚀 Features

### 👤 Citizen Module
- **Secure Onboarding**: Registration and login with JWT authentication.
- **Personalized Dashboard**: Real-time alerts, quick links, and status updates.
- **Complaint System**: Report city issues with categories, descriptions, and status tracking.
- **City Explorer**: Interactive map-based discovery (Placeholder).
- **Alerts**: Real-time emergency, weather, and traffic notifications.

### 🛠 Department Admin Module
- **Department Dashboard**: Overview of complaints within their jurisdiction.
- **Complaint Management**: Update status and add resolution notes.
- **Analytics**: Department-specific performance metrics.

### 🏛 Super Admin Module
- **Full System Control**: Manage users, roles, and departments.
- **City-Wide Analytics**: Consolidated view of all city data.
- **Broadcasting**: Send city-wide emergency alerts and job notifications.

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion, Recharts, Lucide React, Zustand.
- **Backend**: Node.js, Express, Better-SQLite3, JWT, Bcrypt.
- **Build Tool**: Vite.

## 📦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

3. **Default Credentials**:
   - **Super Admin**: `admin@smartcity.gov` / `admin123`
   - **Dept Admin**: `waste@smartcity.gov` / `admin123`

## 📂 Project Structure

- `/server.ts`: Express server with SQLite database and API routes.
- `/src/App.tsx`: Main React application with routing.
- `/src/store.ts`: Zustand store for authentication and global state.
- `/src/components/`: Reusable UI components and page layouts.
- `/city.db`: SQLite database file (generated on first run).

## 🛡 Security

- **Authentication**: Stateless JWT-based auth.
- **Authorization**: Role-Based Access Control (RBAC) enforced on both frontend and backend.
- **Password Hashing**: BCrypt with 10 salt rounds.
- **Input Validation**: Zod schema validation on the frontend.
