import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../portal/components/Header';
import Footer from '../portal/components/Footer';

const UserLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default UserLayout;
