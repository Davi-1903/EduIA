import { memo } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/sidebar/index';

function ProtectedLayout() {
    return (
        <>
            <Sidebar />
            <Outlet />
        </>
    );
}

export default memo(ProtectedLayout);
