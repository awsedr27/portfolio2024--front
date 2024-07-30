// Header.tsx
import React, { useState } from 'react';
import styles from './Header.module.css'; 

// FontAwesome 관련 import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes, faBars } from '@fortawesome/free-solid-svg-icons';

const Header: React.FC = () => {


  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <a href="/">PortFolio</a>
      </div>
      <nav className={`${styles.navbar}`}>
        <ul className={styles.navLinks}>
          <li><a href="#home">Top50</a></li>
          <li><a href="#products">신제품</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className={styles.searchBar}>
          <input type="text" placeholder="Search..." />
          <button>Search</button>
        </div>
        <div className={styles.cart}>
          <a href="/cart">
            <FontAwesomeIcon icon={faShoppingCart} />
            <span className={styles.cartCount}>3</span>
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
