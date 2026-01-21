import { memo } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/header';

function UnprotectedLayout() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}

export default memo(UnprotectedLayout);
