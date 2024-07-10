import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../network/Api';

const NaverLogin = () => {
    const location = useLocation();
    const nav = useNavigate();

    useEffect(() => {
        async function loginLogic() {
            const params = new URLSearchParams(location.search);
            const code = params.get('code');
            const state = params.get('state');
            const savedState = localStorage.getItem('stateToken');
            localStorage.removeItem('stateToken');
            if (code && state && state === savedState) {
                try {
                    const response = await axiosInstance.post('/api/user/login/naver', { code,state },{withCredentials:true});
                    const authorizationHeader  = response.headers['authorization'];
                    if (authorizationHeader ) {
                        const accessToken = authorizationHeader.split('Bearer ')[1];
                        localStorage.setItem('accessToken', accessToken);
                        nav('/main', { replace: true });
                      } else {
                        alert('Do not found accessToken');
                        nav('/login',{ replace: true });
                      }
                } catch (error) {
                    alert('로그인에 실패했습니다. 잠시 후 다시 시도해주세요');
                    nav('/login',{ replace: true });
                }
            } else {
                alert('Invalid state token');
                nav('/login',{ replace: true });
            }
        }
        loginLogic();
    }, []);

    return <div>로그인 처리 중...</div>;
};

export default NaverLogin;
