import { memo } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/sidebar/components/desk';

function ProtectedLayout() {
    return (
        <>
            <Sidebar />
            <Outlet />
        </>
    );
}

export default memo(ProtectedLayout);
