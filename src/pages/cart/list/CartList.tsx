import React, { useEffect, useState } from 'react';
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



const Cart: React.FC = () => {
  const nav = useNavigate();
    const [cartListScreenData, setCartListScreenData] = useState<CartListScreenData>({cartList:[],calcuatedAllPrice:0,isAllSelect:false,
      calcuatedAllDeliveryPrice:0,calcuatedAllDiscountPrice:0,calcuatedPayPrice:0});

    useEffect(() => {
        fetchCartList();
      }, []);
      const fetchCartList = async () => {
        try {
          const response = await axiosInstance.post('/api/cart/list');
          const resultData:CartListResponse=response.data;
          const cartList=transformCartListResponse(resultData);
          setCartListScreenData(prevState => {
            const updatedCartList = [...cartList];
            const updatedAllPrice = updatedCartList.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            );
            const updatedAllDiscountPrice:number=0;
            const updatedAllDeliveryPrice:number=0;
            const updatedPayPrice:number=updatedAllPrice-updatedAllDiscountPrice+updatedAllDeliveryPrice;
            return {
              isAllSelect:false,
              cartList: updatedCartList,
              calcuatedAllPrice: updatedAllPrice,
              calcuatedAllDiscountPrice:updatedAllDiscountPrice,
              calcuatedAllDeliveryPrice:updatedAllDeliveryPrice,
              calcuatedPayPrice:updatedPayPrice
            };
          });
        } catch (error) {
          console.error('Error fetching cart List:', error);
        }
      };
      const handleCartUpdateQuantityBtnClick = async (productId:number,quantity: number) => {
        try{
          if(quantity<=0){
            return;
          }
          const cartUpdateRequest:CartUpdateRequest={productId:productId,quantity:quantity};

          const response=await axiosInstance.post('/api/cart/update',cartUpdateRequest);
          const resultData:CartUpdateResponse = response.data;

          setCartListScreenData(prevData => {
            const updatedCartList = prevData.cartList.map(item =>
              item.productId === productId ? { ...item, quantity: resultData.quantity } : item
            );
      
            const updatedAllPrice = updatedCartList.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            );
            const updatedAllDiscountPrice:number=0;
            const updatedAllDeliveryPrice:number=0;
            const updatedPayPrice:number=updatedAllPrice-updatedAllDiscountPrice+updatedAllDeliveryPrice;

            return {
              ...prevData,
              cartList: updatedCartList,
              calcuatedAllPrice: updatedAllPrice,
              calcuatedAllDiscountPrice:updatedAllDiscountPrice,
              calcuatedAllDeliveryPrice:updatedAllDeliveryPrice,
              calcuatedPayPrice:updatedPayPrice
            };
          });
        }catch(error){
          console.log(error)
        }
    
      };
      const handleCheckboxChange = (productId:number) => {
        try{
          setCartListScreenData(prevData => ({
            ...prevData,
            cartList: prevData.cartList.map(item =>
              item.productId === productId ? { ...item, checkBox:!item.checkBox} : item
            )
          }));
        }catch(error){
          console.log(error)
        }
      };
      const handleDeleteSelected =async () => {
        try{
          const cartListDeleteRequest:CartListDeleteRequest={productIdList:cartListScreenData.cartList.filter(item => item.checkBox).map(item=>item.productId)}
          if(cartListDeleteRequest.productIdList.length==0){
            alert('삭제할 상품을 선택해주세요');
            return;
          }
          await axiosInstance.post('/api/cart/list/delete',cartListDeleteRequest);
          fetchCartList();
        }catch(error){
          console.log(error)
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
        nav('/order/detail', { state: { orderList } });
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
        nav('/order/detail', { state: { orderList } });
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
          <p>{cartListScreenData.calcuatedAllPrice.toLocaleString('ko-KR')}<span> 원</span></p>
        </div>
        <div className={styles.discountPrice}>
          <p>할인금액</p>
          <p>-{cartListScreenData.calcuatedAllDiscountPrice.toLocaleString('ko-KR')}<span> 원</span></p>
        </div>
        <div className={styles.deliveryPrice}>
          <p>배송비</p>
          <p>{cartListScreenData.calcuatedAllDeliveryPrice.toLocaleString('ko-KR')}<span> 원</span></p>
        </div>
        <div className={styles.payPrice}>
          <h3>최종결제금액</h3>
          <p>{cartListScreenData.calcuatedPayPrice.toLocaleString('ko-KR')}<span> 원</span></p>
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
