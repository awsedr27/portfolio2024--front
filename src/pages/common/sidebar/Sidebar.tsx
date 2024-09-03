import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css'; 

const Sidebar: React.FC = () => {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.sidebarItemContainer}>
        <ul>
          <h1>My PAGE</h1>
          <li><Link to="/myPage">회원정보/수정</Link></li>
          <li><Link to="/myPage/review/list?type=reviewable">상품리뷰</Link></li>
          <li><Link to="/myPage/review">주문확인/주문취소</Link></li>
          <li><Link to="/">회원탈퇴</Link></li>
        </ul>
      </div>
      <div className={styles.sidebarItemContainer}>
        <ul>
          <li><Link to="/myPage"><h3>고객센터</h3></Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
