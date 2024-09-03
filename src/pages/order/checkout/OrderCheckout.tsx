import { useLocation, useNavigate } from "react-router-dom";
import { OrderCheckoutScreenData } from "./OrderCheckoutScreenData";
import { useEffect, useState } from "react";
import styles from './OrderCheckout.module.css'; 
import axiosInstance from "../../../network/Api";
import { CartListForCheckoutRequest } from "../../../data/cart/CartRequest";
import { CartListForCheckoutResponse } from "../../../data/cart/CartResponse";
import { transformCartListForCheckoutResponse } from "../../../converter/CartConverter";
import { OrderItemSaveRequest, OrderSaveRequest } from "../../../data/order/OrderRequest";
import { transformOrderListToOrderItemSaveRequestList } from "../../../converter/OrderConverter";
import validateOrderSaveRequest from "../../../validation/validateOrderSave";

const OrderCheckout: React.FC = () => {
    const location = useLocation();
    const nav = useNavigate();
    const orderListParam: number[] = location.state?.orderList || [];
    const imgLocation = process.env.REACT_APP_PRODUCT_IMG_LOCATION;
    const baseUrl = process.env.REACT_APP_API_URL;
    const [orderCheckoutScreenData, setOrderCheckoutScreenData] = useState<OrderCheckoutScreenData>({orderList:[],postcode:"",roadAddress:"",jibunAddress:"",detailAddress:"",
      calcuatedAllPrice:0,calcuatedPayPrice:0,calcuatedAllDiscountPrice:0,calcuatedAllDeliveryPrice:0
    });
    const [loading, setLoading] = useState(false);
    const [buy, setBuy] = useState(false);
    const fetchCartData = async () => {
      try{
        const cartListForCheckoutRequest:CartListForCheckoutRequest={productIdList:orderListParam};
        const response=await axiosInstance.post('api/cart/list/checkout',cartListForCheckoutRequest);
        const resultData:CartListForCheckoutResponse = response.data;
        const orderList=transformCartListForCheckoutResponse(resultData);
        setOrderCheckoutScreenData(prev=>{
          const updatedAllPrice = orderList.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          );
          const updatedAllDiscountPrice:number=0;
          const updatedAllDeliveryPrice:number=0;
          const updatedPayPrice:number=updatedAllPrice-updatedAllDiscountPrice+updatedAllDeliveryPrice;
          return{
            ...prev,
            orderList:orderList,
            calcuatedAllPrice: updatedAllPrice,
            calcuatedAllDiscountPrice:updatedAllDiscountPrice,
            calcuatedAllDeliveryPrice:updatedAllDeliveryPrice,
            calcuatedPayPrice:updatedPayPrice
          }
        })
      }catch(error){
        nav('/errorPage',{ replace: true });
        return;
      }
    }
    console.log(orderCheckoutScreenData)
    const orderSave = async () => {
      try{
        const orderItemSaveRequest:OrderItemSaveRequest[]=transformOrderListToOrderItemSaveRequestList(orderCheckoutScreenData.orderList);
        const orderSaveRequest:OrderSaveRequest={orderSaveList:orderItemSaveRequest,postcode:orderCheckoutScreenData.postcode,
          roadAddress:orderCheckoutScreenData.roadAddress,jibunAddress:orderCheckoutScreenData.jibunAddress,detailAddress:orderCheckoutScreenData.detailAddress}
        const validationMessage=validateOrderSaveRequest(orderSaveRequest);
        if(validationMessage){
          alert(validationMessage);
          return false;
        }
        const response=await axiosInstance.post('/api/order/save',orderSaveRequest);
        if(response.status===200){
          alert("주문을 완료했습니다");
        }
        return true;
      }catch(error){
        console.log(error);
        return false;
      }
    }
    useEffect(() => {
        const script = document.createElement('script');
        script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        script.onload = () => {
           setLoading(true);
        };
        document.body.appendChild(script);
        fetchCartData();
        return () => {
          document.body.removeChild(script);
        };
      }, []);
      const handleOpenPostSearch = () => {
        if (!loading) {
          console.log('우편주소시스템을 불러오는중입니다...');
          return;
        }
        try{
          new (window as any).daum.Postcode({
            oncomplete: function (data: any) {
              const allDeliveryPrice=4000;
                  setOrderCheckoutScreenData(prev=>{
                    const updatedPayPrice:number=prev.calcuatedAllPrice-prev.calcuatedAllDiscountPrice+allDeliveryPrice;
                    return {
                      ...prev,
                      postcode:data.zonecode,
                      roadAddress:data.roadAddress,
                      jibunAddress:data.jibunAddress,
                      calcuatedAllDeliveryPrice:allDeliveryPrice,
                      calcuatedPayPrice:updatedPayPrice
                    }
                  });
            }
          }).open();
        }catch(error){
          console.log("주소찾기api 오류");
        }
      };
      const handleInputDetailAddress = (event:any) => {
        setOrderCheckoutScreenData(prev=>{
          return {
            ...prev,
            detailAddress:event.target.value
          }
        });
      }
      const handleBuy=async ()=>{
        const result=await orderSave();
        if(result){
          nav('/', { replace: true });
        }
      }
    return(
        <div>
            <div className={styles.postContainer}>
                <h2>배송지 검색</h2>
                <input type="text" className={styles.postInput} id="postcode" placeholder="우편번호" onClick={handleOpenPostSearch} value={orderCheckoutScreenData.postcode} readOnly></input>
                <input type="button" className={styles.postInput} value="우편번호 찾기" onClick={handleOpenPostSearch} disabled={!loading}></input><br></br>
                <input type="text" className={styles.postInput} id="roadAddress" placeholder="도로명주소" value={orderCheckoutScreenData.roadAddress} readOnly></input>
                <input type="text" className={styles.postInput} id="jibunAddress" placeholder="지번주소" value={orderCheckoutScreenData.jibunAddress} readOnly></input>
                <span id="guide" style={{ color: "#999", display: "none" }}></span>
                <input type="text" className={styles.postInput} id="detailAddress" placeholder="상세주소" onChange={handleInputDetailAddress}></input>
            </div>
            <div className={styles.orderContainer}>
                <div className={styles.orderedProductContainer}>
                  <h4>주문 상품</h4>
                  <div className={styles.imageContainer}>
                    {orderCheckoutScreenData.orderList.map((item,index)=>
                    <div key={index} className={styles.imageBox}>
                      {item.imageUrl?(
                          <img 
                            src={`${baseUrl}${imgLocation}${item.imageUrl}`} 
                            alt={item.productName} 
                          />
                      ):(<p className={styles.imgAltText}>이미지 준비 중</p>)}
                      <div className={styles.imageTextContainer}>
                        <p>{item.productName}</p>
                        <span>수량 : {item.quantity}개</span>
                      </div>
                    </div>
                    )}
                  </div>  
                </div>
                <div className={styles.orderPayContainer}>
                    <div className={styles.orderPrice}>
                    <p>주문금액</p>
                    <p>{orderCheckoutScreenData.calcuatedAllPrice.toLocaleString('ko-KR')}<span> 원</span></p>
                    </div>
                    <div className={styles.discountPrice}>
                    <p>할인금액</p>
                    <p>-{orderCheckoutScreenData.calcuatedAllDiscountPrice.toLocaleString('ko-KR')}<span> 원</span></p>
                    </div>
                    <div className={styles.deliveryPrice}>
                    <p>배송비</p>
                    <p>{orderCheckoutScreenData.calcuatedAllDeliveryPrice.toLocaleString('ko-KR')}<span> 원</span></p>
                    </div>
                    <div className={styles.payPrice}>
                    <h3>최종결제금액</h3>
                    <p>{orderCheckoutScreenData.calcuatedPayPrice.toLocaleString('ko-KR')}<span> 원</span></p>
                    </div>
                    <div className={styles.buttonGroup}>
                    <button className={styles.orderButton} onClick={handleBuy} disabled={buy}>주문하기</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default OrderCheckout;
