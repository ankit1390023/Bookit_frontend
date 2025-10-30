import { Outlet } from 'react-router-dom';
import Header from './Header';


const Layout = () => {
    return (
        <div className="min-h-screen  p-6">
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;