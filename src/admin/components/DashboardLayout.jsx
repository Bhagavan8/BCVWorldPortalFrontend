import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import Footer from './Footer';

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="admin-dashboard">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <main className="main-content d-flex flex-column min-vh-100">
                <TopNav toggleSidebar={toggleSidebar} />
                {children}
                <Footer />
            </main>
        </div>
    );
};

export default DashboardLayout;
