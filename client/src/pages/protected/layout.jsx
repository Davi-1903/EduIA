import { memo } from 'react';
import Header from '../../components/header';
import { Outlet } from 'react-router-dom';

function ProtectedLayout() {
    return (
        <>
            {/* Será um sidebar, mas por enquanto ficará o header */}
            <Header />
            <Outlet />
        </>
    );
}

export default memo(ProtectedLayout);
