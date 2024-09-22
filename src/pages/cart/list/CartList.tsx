import React, { useEffect, useRef, useState } from 'react';
import styles from './CartList.module.css';
import CartItemComponent from '../../../components/cart/CartItemComponent';
import axiosInstance from '../../../network/Api';
import { CartListScreenData } from './CartListScreenData';
import { CartItem } from '../../../components/cart/CartItemComponentScreenData';
import { CartListResponse, CartUpdateResponse } from '../../../data/cart/CartResponse';
import { transformCartListResponse } from '../../../converter/CartConverter';
import { CartListDeleteRequest, CartUpdateRequest } from '../../../data/cart/CartRequest';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useLayoutContext } from '../../../context/LayoutContext';
import { useSpinner } from '../../../context/SpinnerContext';

const Cart: React.FC = () => {
  const nav = useNavigate();
  const {loading,setLoading } = useSpinner();
  const loadingRef = useRef(false);
  const { setCartListCnt } = useLayoutContext();
    const [cartListScreenData, setCartListScreenData] = useState<CartListScreenData>({cartList:[],isAllSelect:false});

      const updatedAllPrice = cartListScreenData.cartList.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      const updatedAllDiscountPrice:number=0;
      const updatedPayPrice:number=updatedAllPrice-updatedAllDiscountPrice;

    useEffect(() => {
        window.scrollTo(0, 0);
        init();
      }, []);
      const fetchCartListCount = async () => {
          const response = await axiosInstance.post('/api/cart/list/count');
          return response.data;
      };
      const getCartList = async () => {
          const response = await axiosInstance.post('/api/cart/list');
          const resultData:CartListResponse=response.data;
          const cartList=transformCartListResponse(resultData);
          return cartList;
      };
      const init=async ()=>{
        try{
          if(loadingRef.current){return;}
          loadingRef.current=true;
          setLoading(true);
          const cartList=await getCartList();
          setCartListScreenData(prevState => {
            return {
              isAllSelect:false,
              cartList: cartList
            };
          });
          setLoading(false);
          loadingRef.current=false;
        }catch(error){
            setLoading(false);
            nav('/errorPage',{ replace: true });
        }
      }
      const handleCartUpdateQuantityBtnClick = async (productId:number,quantity: number) => {
        try{
          if(quantity<=0){
            return;
          }
           if(loadingRef.current){return;}
           loadingRef.current=true;
          //setLoading(true);
          const cartUpdateRequest:CartUpdateRequest={productId:productId,quantity:quantity};
          const response=await axiosInstance.post('/api/cart/update',cartUpdateRequest);
          const resultData:CartUpdateResponse = response.data;
          setCartListScreenData(prevData => {
            const updatedCartList = prevData.cartList.map(item =>
              item.productId === productId ? { ...item, quantity: resultData.quantity } : item
            );
            return {
              ...prevData,
              cartList: updatedCartList
            };
          });
          //setLoading(false);
           loadingRef.current=false;
        }catch(error){
          //setLoading(false);
          nav('/errorPage',{ replace: true });
        }
      };
      const handleCheckboxChange = (productId:number) => {
          setCartListScreenData(prevData => ({
            ...prevData,
            cartList: prevData.cartList.map(item =>
              item.productId === productId ? { ...item, checkBox:!item.checkBox} : item
            )
          }));
      };
      const handleDeleteSelected =async () => {
        try{
          const cartListDeleteRequest:CartListDeleteRequest={productIdList:cartListScreenData.cartList.filter(item => item.checkBox).map(item=>item.productId)}
          if(cartListDeleteRequest.productIdList.length==0){
            alert('삭제할 상품을 선택해주세요');
            return;
          }
          if(loadingRef.current){return;}
          loadingRef.current=true;
          setLoading(true);
          await axiosInstance.post('/api/cart/list/delete',cartListDeleteRequest);
          const cartList=await getCartList();
          const cartListCount:number=await fetchCartListCount();
          setCartListScreenData(prev=>{
            return({
              isAllSelect:false,
              cartList:cartList
            })
          })
          setCartListCnt(cartListCount);
          setLoading(false);
          loadingRef.current=false;
        }catch(error){
          setLoading(false);
          nav('/errorPage',{ replace: true });
        }
      };
      const handleCartBtnClick = (productId:number) => {
        nav(`/product/${productId}`);
      };
      const handleSelectAllBtnClick =  () => {
        const newIsAllSelected = !cartListScreenData.isAllSelect;

        setCartListScreenData(prevData => ({
          ...prevData,
          isAllSelect:newIsAllSelected,
          cartList: prevData.cartList.map(item => ({
            ...item,
            checkBox:newIsAllSelected
          }))
        }));
      };
      const handleBuyAll=()=>{
        const orderList:number[]=[];
        cartListScreenData.cartList.map(item=>{
          orderList.push(item.productId);
        })
        if(orderList.length==0){
          alert("장바구니를 추가해주세요");
          return;
        }
        nav('/order/checkout', { state: { orderList } });
      }
      const handleBuySelected=()=>{
        const orderList:number[]=[];
        cartListScreenData.cartList.map(item=>{
          if (item.checkBox) { 
            orderList.push(item.productId);
          }
        })
        if(orderList.length==0){
          alert("구매하실 상품을 선택해주세요");
          return;
        }
        nav('/order/checkout', { state: { orderList } });
      }
  return (
    <div className={styles.container}>
      <div className={styles.cartListContainer}>
        <h2 className={styles.heading}>장바구니</h2>
        <div className={styles.actionsContainer}>
          <p onClick={handleSelectAllBtnClick}>전체선택</p>
          <p onClick={handleDeleteSelected}>선택삭제</p>
        </div>
        <table>
          <colgroup>
            <col style={{ width: 'auto' }} />
            <col style={{ width: '150px' }} />
            <col style={{ width: '130px' }} />
          </colgroup>
          <thead>
            <tr className={styles.header}>
              <th>상품정보</th>
              <th>구매가격</th>
              <th>구매수량</th>
            </tr>
          </thead>
          <tbody>
          {cartListScreenData.cartList.map(item => (
            <CartItemComponent key={item.productId} cartItem={item} onUpdateQuantity={handleCartUpdateQuantityBtnClick} onCheckboxChange={handleCheckboxChange} 
            onClickCart={handleCartBtnClick}/>
          ))}
          </tbody>
        </table>
      </div>
      <div className={styles.payContainer}>
        <div className={styles.orderPrice}>
          <p>주문금액</p>
          <p>{updatedAllPrice.toLocaleString('ko-KR')}<span> 원</span></p>
        </div>
        <div className={styles.discountPrice}>
          <p>할인금액</p>
          <p>-{updatedAllDiscountPrice.toLocaleString('ko-KR')}<span> 원</span></p>
        </div>
        <div className={styles.payPrice}>
          <h3>최종결제금액</h3>
          <p>{updatedPayPrice.toLocaleString('ko-KR')}<span> 원</span></p>
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.buyAllButton} onClick={handleBuyAll}>전체상품 구매하기</button>
          <button className={styles.buySelectedButton} onClick={handleBuySelected}>선택상품 구매하기</button>
      </div>
      </div>
    </div>
  );
};

export default Cart;
