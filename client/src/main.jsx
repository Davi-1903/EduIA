import { lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Layout from './layout';
const SignUp = lazy(() => import('./pages/unprotected/signup'));
const SignIn = lazy(() => import('./pages/unprotected/signin'));

import './globals.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <h1>Home</h1> },
            { path: 'dash', element: <h1>Dashboard</h1> },
            { path: 'perfil', element: <h1>Perfil</h1> },
            { path: 'historico', element: <h1>Historico</h1> },
            { path: 'sobre', element: <h1>Sobre</h1> },
            { path: 'config', element: <h1>Config</h1> },
        ],
    },
    { path: '/login', element: <SignIn /> },
    { path: '/cadastro', element: <SignUp /> },
]);

createRoot(document.getElementById('root')).render(
    <>
        <RouterProvider router={router} />
    </>,
);
