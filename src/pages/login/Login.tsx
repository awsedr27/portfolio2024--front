const Login = () => {
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
        <button onClick={naverLogin}>
            네이버 로그인
        </button>
    );
};

export default Login;