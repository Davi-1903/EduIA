import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './layout';
import './globals.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <h1>Home</h1> },
            { path: 'signin', element: <h1>Signin</h1> },
            { path: 'signup', element: <h1>Signup</h1> },
            { path: 'dash', element: <h1>Dashboard</h1> },
            { path: 'profile', element: <h1>Profile</h1> },
            { path: 'history', element: <h1>History</h1> },
            { path: 'about', element: <h1>About</h1> },
            { path: 'config', element: <h1>Config</h1> },
        ],
    },
]);

createRoot(document.getElementById('root')).render(
    <>
        <RouterProvider router={router} />
    </>,
);
