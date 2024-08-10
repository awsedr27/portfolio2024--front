import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { LayoutContextProvider } from '../../context/LayoutContext';

const Layout: React.FC = () => {
  return (
    <LayoutContextProvider>
    <div>
      <Header />
      <main style={{minHeight:"100vh"}}>
        <Outlet />
      </main>
      <Footer />
    </div>
    </LayoutContextProvider>
  );
};

export default Layout;
