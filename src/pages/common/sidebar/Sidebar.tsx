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
          <li><Link to="/myPage/order/check">주문확인/주문취소</Link></li>
          <li><Link to="/myPage/user/delete">회원탈퇴</Link></li>
        </ul>
      </div>
      <div className={styles.sidebarItemContainer}>
        <ul>
          <li>
          <h3>고객센터 문의</h3>
          <p>awsedr0527@daum.net</p>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
