import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../portal/components/Header';
import Footer from '../portal/components/Footer';
const UserLayout = () => {
  return (
    <div className="font-sans">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
