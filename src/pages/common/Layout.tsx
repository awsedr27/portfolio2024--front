import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { LayoutContextProvider } from '../../context/LayoutContext';
import styles from './Layout.module.css';

const Layout: React.FC = () => {
  return (
    <LayoutContextProvider>
    <div>
      <Header />
      <main className={styles.mainStyle}>
        <Outlet />
      </main>
      <Footer />
    </div>
    </LayoutContextProvider>
  );
};

export default Layout;
