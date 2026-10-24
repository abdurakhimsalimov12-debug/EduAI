import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import { ProtectedRoute, AdminRoute } from './components/ui/RouteGuards.jsx';

import HomePage from './pages/HomePage.jsx';
import SubjectsPage from './pages/SubjectsPage.jsx';
import SubjectDetailPage from './pages/SubjectDetailPage.jsx';
import LessonPage from './pages/LessonPage.jsx';
import QuizPage from './pages/QuizPage.jsx';
import AITutorPage from './pages/AITutorPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Ommaviy */}
          <Route path="/" element={<HomePage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/subjects/:slug" element={<SubjectDetailPage />} />
          <Route path="/lessons/:id" element={<LessonPage />} />
          <Route path="/quiz/:id" element={<QuizPage />} />
          <Route path="/ai" element={<AITutorPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Login talab qiladi */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
