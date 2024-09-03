import styles from './Login.module.css';
const Login: React.FC = () => {
    const clientId = process.env.REACT_APP_NAVER_LOGIN_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_NAVER_LOGIN_REDIRECT_URL;
    
    const generateStateToken = (): string => {
        const randomPart = Math.random().toString(36).substring(2, 15);
        const timestampPart = Date.now().toString();
        const state = `${randomPart}${timestampPart}`;
        localStorage.setItem('stateToken', state);
        return state;
    };

    const naverLogin = () => {
        const state = generateStateToken();
        const apiUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
        window.location.href = apiUrl;
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginContainer}>
                <div className={styles.logo}>
                    <a href="/">PortFolio</a>
                </div>
                <div className={styles.loginBox}>
                    <div className={styles.btnContainer}>
                        <button onClick={naverLogin} className={styles.naverBtn}>
                            <img src={'../btnG_login.png'}/>
                            <p>네이버로 시작하기</p>
                        </button>
                    </div>
                    <div className={styles.btnContainer}>
                        <button onClick={naverLogin} className={styles.gBtn}>
                            <h3>G</h3>
                            <p>Guest1로 시작하기</p>
                        </button>
                    </div>
                    <div className={styles.btnContainer}>
                        <button onClick={naverLogin} className={styles.gBtn}>
                            <h3>G</h3>
                            <p>Guest2로 시작하기</p>
                        </button>
                    </div>
                </div>
                <div className={styles.textContainer}>
                    <p>개인프로젝트 웹서비스입니다</p>
                    <p>This is a personal project web service</p>
                    <p>게스트로 시작하기를 이용해주세요</p>
                </div>
            </div>
            <footer className={styles.footer}>
                <p>&copy; CopyRight 2024. portfolio by kim All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Login;