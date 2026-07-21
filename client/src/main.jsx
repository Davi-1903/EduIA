import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import WrapperProvider from './context/wrapperProvider';
import Loading from './components/loading';

import Layout from './layout';
const SignUp = lazy(() => import('./pages/unprotected/signup'));
const SignIn = lazy(() => import('./pages/unprotected/signin'));
const About = lazy(() => import('./pages/unprotected/about'));
const LandingPage = lazy(() => import('./pages/unprotected/landingpage'));
const Error404 = lazy(() => import('./pages/errors/error404'));
const Dashboard = lazy(() => import('./pages/protected/dash'));
const Materials = lazy(() => import('./pages/protected/materials'));
const Settings = lazy(() => import('./pages/protected/config'));
const Profile = lazy(() => import('./pages/protected/profile/index'));

import './globals.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<Loading />}>
                        <LandingPage />
                    </Suspense>
                ),
            },
            {
                path: 'dash',
                element: (
                    <Suspense fallback={<Loading />}>
                        <Dashboard />
                    </Suspense>
                ),
            },
            {
                path: 'perfil',
                element: (
                    <Suspense fallback={<Loading />}>
                        <Profile />
                    </Suspense>
                ),
            },
            { path: 'historico', element: <h1>Historico</h1> },
            {
                path: 'sobre',
                element: (
                    <Suspense fallback={<Loading />}>
                        <About />
                    </Suspense>
                ),
            },
            {
                path: 'settings',
                element: (
                    <Suspense fallback={<Loading />}>
                        <Settings />
                    </Suspense>
                ),
            },
            {
                path: 'materials',
                element: (
                    <Suspense fallback={<Loading />}>
                        <Materials />
                    </Suspense>
                ),
            },
            {
                path: '*',
                element: (
                    <Suspense fallback={<Loading />}>
                        <Error404 />
                    </Suspense>
                ),
            },
        ],
    },
    // Procurar fazer uma gambiarra para esse layout diferente :)
    {
        path: 'login',
        element: (
            <Suspense fallback={<Loading />}>
                <SignIn />
            </Suspense>
        ),
    },
    {
        path: 'cadastro',
        element: (
            <Suspense fallback={<Loading />}>
                <SignUp />
            </Suspense>
        ),
    },
]);

createRoot(document.getElementById('root')).render(
    <HelmetProvider>
        <WrapperProvider>
            <RouterProvider router={router} />
        </WrapperProvider>
    </HelmetProvider>,
);
