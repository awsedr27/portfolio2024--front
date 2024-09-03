
import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './SidebarLayout.module.css'; 
import Sidebar from '../sidebar/Sidebar';

const SidebarLayout: React.FC = () => {
  return (
    <div className={styles.content}>
          <Sidebar />
          <main className={styles.mainStyle}>
            <Outlet />
          </main>
    </div>
  );
};

export default SidebarLayout;
