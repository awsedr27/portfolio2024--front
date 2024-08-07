import React, { useEffect, useState } from 'react';
import styles from './CartList.module.css';
import CartItemComponent from '../../../components/cart/CartItemComponent';
import axiosInstance from '../../../network/Api';
import { CartListScreenData } from './CartListScreenData';
import { CartItem } from '../../../components/cart/CartItemComponentScreenData';
import { CartListResponse, CartUpdateResponse } from '../../../data/cart/CartResponse';
import { transformCartListResponse } from '../../../converter/CartConverter';
import { CartListDeleteRequest, CartUpdateRequest } from '../../../data/cart/CartRequest';



const Cart: React.FC = () => {
    
    const [cartListScreenData, setCartListScreenData] = useState<CartListScreenData>({cartList:[]});
    useEffect(() => {
        const fetchCartList = async () => {
          try {
            const response = await axiosInstance.post('/api/cart/list');
            const resultData:CartListResponse=response.data;
            const cartList=transformCartListResponse(resultData);
            setCartListScreenData(prevState => ({
                cartList: [...prevState.cartList, ...cartList]
              }));

          } catch (error) {
            console.error('Error fetching cart List:', error);
          }
        };
    
        fetchCartList();
      }, []);


      const handleCartUpdateQuantityBtnClick = async (productId:number,quantity: number) => {
        try{
          if(quantity<=0){
            return;
          }
          const cartUpdateRequest:CartUpdateRequest={productId:productId,quantity:quantity};
          const response=await axiosInstance.post('/api/cart/update',cartUpdateRequest);
          const resultData:CartUpdateResponse = response.data;
          setCartListScreenData(prevData => ({
            ...prevData,
            cartList: prevData.cartList.map(item =>
              item.productId === productId ? { ...item, quantity:resultData.quantity} : item
            )
          }));
        }catch(error){
          console.log(error)
        }
    
      };
      const handleCheckboxChange = (productId:number,isChecked:boolean) => {
        try{
          setCartListScreenData(prevData => ({
            ...prevData,
            cartList: prevData.cartList.map(item =>
              item.productId === productId ? { ...item, checkBox:isChecked} : item
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
          }
          await axiosInstance.post('/api/cart/list/delete',cartListDeleteRequest);
          setCartListScreenData(prevData => ({
            ...prevData,
            cartList: prevData.cartList.filter(item => !item.checkBox) 
          }));
        }catch(error){
          console.log(error)
        }
      };
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Shopping Cart</h2>
      <ul>
        {cartListScreenData.cartList.map(item => (
          <CartItemComponent key={item.productId} cartItem={item} onUpdateQuantity={handleCartUpdateQuantityBtnClick} onCheckboxChange={handleCheckboxChange} />
        ))}
        <div className={styles.itemActions}>
          <button className={styles.button} onClick={handleDeleteSelected}>Remove</button>
      </div>
      </ul>
    </div>
  );
};

export default Cart;
