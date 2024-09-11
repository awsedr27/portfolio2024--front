import { useState } from 'react';
import styles from './UserDelete.module.css'; 
import axiosInstance from '../../../network/Api';
import { useNavigate } from 'react-router-dom';


const UserDelete: React.FC = () => {
    const [confirmationText, setConfirmationText] = useState('');
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const handleChangeText=(text:string)=>{
        setConfirmationText(text);
    }
    const handleDeleteUser=async ()=>{
        try{
            if(confirmationText!=='회원탈퇴'){
                return;
            }
            if(loading){
                return;
            }
            const userConfirmed = window.confirm('정말 회원탈퇴를 하시겠습니까?');
            if(userConfirmed){
                setLoading(true);
                const response = await axiosInstance.post('/api/user/delete');
                alert("asdf")
                if(response.status===200){
                    localStorage.removeItem('accessToken');
                    window.location.replace("/login");
                }
            }
        }catch(error){
            nav('/errorPage',{ replace: true });
            return;
        }finally {
            setLoading(false);
        }
    }
return (
    <div className={styles.userDeleteContainer}>
        <div className={styles.headerTitle}><h2>회원탈퇴</h2></div>
        <p>회원 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.</p>
        <p>탈퇴를 원하시면 회원 탈퇴 를 입력해주세요</p>
        <input
            type="text"
            placeholder="회원탈퇴"
            value={confirmationText}
            onChange={(e) => handleChangeText(e.target.value)}
            disabled={loading}
        />
        <button onClick={handleDeleteUser} disabled={(confirmationText!=='회원탈퇴')}>
            {loading ? '탈퇴 진행 중...' : '회원 탈퇴'}
        </button>
    </div>
);
}
export default UserDelete;