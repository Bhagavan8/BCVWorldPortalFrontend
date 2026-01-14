import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../portal/components/Header';
import Footer from '../portal/components/Footer';

const UserLayout = () => {
  return (
    <div className="font-sans">
      <Header />
      <main className="pt-28 sm:pt-28 md:pt-32">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
