import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../network/Api';

const NaverLogin = () => {
    const location = useLocation();

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
                    if(response.status!==200){
                        throw new Error("로그인 실패");
                    }
                    const authorizationHeader = response.headers['authorization'];
                    if (authorizationHeader) {
                        const accessToken = authorizationHeader.split('Bearer ')[1];
                        if(!accessToken){
                            throw new Error("로그인 실패");
                        }
                        localStorage.setItem('accessToken', accessToken);
                        window.location.replace("/");
                      } else {
                        alert('Do not found accessToken');
                        window.location.replace("/login");
                      }
                } catch (error:any) {
                    console.log(error);
                    if(error.response.status===400){
                        alert(error.response.data);
                    }else{
                        alert('로그인에 실패했습니다. 잠시 후 다시 시도해주세요!');
                    }
                    window.location.replace("/login");
                }
            } else {
                alert('Invalid state token');
                window.location.replace("/login");
            }
        }
        loginLogic();
    }, []);

    return <div>로그인 처리 중...</div>;
};

export default NaverLogin;
