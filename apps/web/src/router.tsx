import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import Layout from './components/Layout';
import AiAssistantPage from './pages/AiAssistantPage';
import ApplicationsPage from './pages/ApplicationsPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import InterviewsPage from './pages/InterviewsPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import PipelinePage from './pages/PipelinePage';
import RegisterPage from './pages/RegisterPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'applications', element: <ApplicationsPage /> },
          { path: 'pipeline', element: <PipelinePage /> },
          { path: 'interviews', element: <InterviewsPage /> },
          { path: 'ai-assistant', element: <AiAssistantPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);