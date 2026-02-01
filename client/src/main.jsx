import { lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import WrapperProvider from './context/wrapperProvider';
import ProtectedRoute from './components/protectedRoute';

import Layout from './layout';
const SignUp = lazy(() => import('./pages/unprotected/signup'));
const SignIn = lazy(() => import('./pages/unprotected/signin'));
const LandingPage = lazy(() => import('./pages/unprotected/landingpage'));
const Error404 = lazy(() => import('./pages/errors/error404'));
const Dashboard = lazy(() => import('./pages/protected/dash'))

import './globals.css';
import UnprotectedLayout from './pages/unprotected/layout';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <LandingPage /> },
            { path: 'dash', element: <Dashboard /> },
            { path: 'perfil', element: <h1>Perfil</h1> },
            { path: 'historico', element: <h1>Historico</h1> },
            { path: 'sobre', element: <h1>Sobre</h1> },
            { path: 'config', element: <h1>Config</h1> },
            { path: '*', element: <Error404 /> },
        ],
    },
    // Procurar fazer uma gambiarra para esse layout diferente :)
    { path: 'login', element: <SignIn /> },
    { path: 'cadastro', element: <SignUp /> },
]);

createRoot(document.getElementById('root')).render(
    <HelmetProvider>
        <WrapperProvider>
            <RouterProvider router={router} />
        </WrapperProvider>
    </HelmetProvider>,
);
