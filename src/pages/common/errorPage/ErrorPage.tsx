import React from 'react';
import styles from './ErrorPage.module.css';
import { useNavigate } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  const nav = useNavigate();
  const handleGoToMain=()=>{
    nav('/', { replace: true });
  }
  return (
    <div className={styles.errorContainer}>
      <h3>오류가 발생했어요</h3>
      <h5>쇼핑에 불편을 드려 죄송합니다</h5><br></br>
      <h5>잠시후 다시 이용해주시기 바랍니다</h5>
      <button onClick={handleGoToMain}>홈으로</button>
    </div>
  );
};

export default ErrorPage;
