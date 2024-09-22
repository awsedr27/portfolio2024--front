import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import { LayoutContextProvider } from '../../../context/LayoutContext';
import styles from './Layout.module.css';

const Layout: React.FC = () => {
  return (
    <LayoutContextProvider>
    <div className={styles.topContainer}>
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
