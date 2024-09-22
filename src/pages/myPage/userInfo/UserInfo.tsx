import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './UserInfo.module.css'; 
import axiosInstance from '../../../network/Api';
import { UserMyPageInfoResponse } from '../../../data/user/UserResponse';
import { UserInfoScreenData } from './UserInfoScreenData';
import { UserMyPageInfoUpdateRequest } from '../../../data/user/UserRequest';
import { useSpinner } from '../../../context/SpinnerContext';

const UserInfo: React.FC = () => {
  const nav = useNavigate();
  const loadingRef = useRef(false);
  const {loading,setLoading } = useSpinner();
  const [userInfoScreenData, setUserInfoScreenData] = useState<UserInfoScreenData>();
  const getUserInfo=async ()=>{
      const response = await axiosInstance.post('/api/user/myPage/info');
      const resultData:UserMyPageInfoResponse = response.data;
      const userInfo:UserInfoScreenData={...resultData};
      return userInfo;
  }
  const init=async ()=>{
    try{
      if(loadingRef.current){return;}
      loadingRef.current=true;
      setLoading(true);
      const userInfo=await getUserInfo();
      setUserInfoScreenData(userInfo);
      setLoading(false);
      loadingRef.current=false;
    }catch(error){
      setLoading(false);
      nav('/errorPage',{ replace: true });
    }
  }
  useEffect(() => {
    window.scrollTo(0, 0);
    init()
  }, []);

  if (!userInfoScreenData){return <p>Loading...</p>;}

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userInfoScreenData) {
      setUserInfoScreenData({
        ...userInfoScreenData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      if(!userInfoScreenData){
        return;
      }
      if(loadingRef.current){return;}
      loadingRef.current=true;
      setLoading(true);
      loadingRef.current=true;
      const updateRequest:UserMyPageInfoUpdateRequest={nickname:userInfoScreenData.nickname,email:userInfoScreenData?.email}
      const response = await axiosInstance.post('/api/user/myPage/info/update',updateRequest);
      setLoading(false);
      loadingRef.current=false;
      nav('/',{ replace: true });
    }catch(error){
      setLoading(false);
      nav('/errorPage',{ replace: true });
    }
  };

  return (
    <div className={styles.userInfoContainer}>
      <h2>회원 정보 관리</h2>
      <form onSubmit={handleSubmit}>
      <table>
        <colgroup>
          <col width='20%'></col>
          <col width='*'></col>
        </colgroup>
        <tbody>
          <tr>
            <th>이름</th>
            <td>
              {userInfoScreenData.username}
            </td>
          </tr>
          <tr>
            <th>닉네임</th>
            <td>
            <input
                type="text"
                name="nickname"
                value={userInfoScreenData.nickname}
                onChange={handleChange}
                required
              />
            </td>
          </tr>
          <tr>
            <th>성별</th>
            <td>
              {userInfoScreenData.gender}
            </td>
          </tr>
          <tr>
            <th>이메일</th>
            <td className={styles.tableInputStyle}>
            <input
                type="email"
                name="email"
                value={userInfoScreenData.email||undefined}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <th>생년월일</th>
            <td>
              {userInfoScreenData.birthyear+"-"+userInfoScreenData.birthday}
            </td>
          </tr>
        </tbody>
      </table>
      <div className={styles.buttonContainer}>
        <button type="submit">저장</button>
      </div>
      </form>
    </div>
  );
};

export default UserInfo;
