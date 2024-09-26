import { useLocation, useNavigate } from "react-router-dom";
import { OrderCheckoutScreenData } from "./OrderCheckoutScreenData";
import { useEffect, useRef, useState } from "react";
import styles from './OrderCheckout.module.css'; 
import axiosInstance from "../../../network/Api";
import { CartListForCheckoutRequest } from "../../../data/cart/CartRequest";
import { CartListForCheckoutResponse } from "../../../data/cart/CartResponse";
import { transformCartListForCheckoutResponse } from "../../../converter/CartConverter";
import { OrderItemSaveRequest, OrderSaveRequest } from "../../../data/order/OrderRequest";
import { transformOrderListToOrderItemSaveRequestList } from "../../../converter/OrderConverter";
import ValidateOrderSaveRequest from "../../../validation/ValidationOrder";
import { useSpinner } from "../../../context/SpinnerContext";
import { useLayoutContext } from "../../../context/LayoutContext";

const OrderCheckout: React.FC = () => {
    const location = useLocation();
    const nav = useNavigate();
    const {loading,setLoading } = useSpinner();
    const loadingRef = useRef(false);
    const { setCartListCnt } = useLayoutContext();
    const orderListParam: number[] = location.state?.orderList || [];
    const imgLocation = process.env.REACT_APP_PRODUCT_IMG_LOCATION;
    const baseUrl = process.env.REACT_APP_API_URL;
    const [orderCheckoutScreenData, setOrderCheckoutScreenData] = useState<OrderCheckoutScreenData>({orderList:[],postcode:"",roadAddress:"",jibunAddress:"",detailAddress:"",
    });
    const [postcodeRoading, setPostcodeRoading] = useState(false);

    let updatedAllPrice = orderCheckoutScreenData.orderList.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    let updatedAllDiscountPrice:number=0;
    let updatedAllDeliveryPrice:number=4000;
    let updatedPayPrice:number=updatedAllPrice-updatedAllDiscountPrice+updatedAllDeliveryPrice;
    const fetchCartData = async () => {
        const cartListForCheckoutRequest:CartListForCheckoutRequest={productIdList:orderListParam};
        const response=await axiosInstance.post('api/cart/list/checkout',cartListForCheckoutRequest);
        const resultData:CartListForCheckoutResponse = response.data;
        const orderList=transformCartListForCheckoutResponse(resultData);
        return orderList;

    }
    const init=async ()=>{
      try{
        if(loadingRef.current){return;}
        loadingRef.current=true;
        setLoading(true);
        const cartData=await fetchCartData();
        setOrderCheckoutScreenData(prev=>{
          return{
            ...prev,
            orderList:cartData,
            calcuatedAllPrice: updatedAllPrice,
            calcuatedAllDiscountPrice:updatedAllDiscountPrice,
            calcuatedAllDeliveryPrice:updatedAllDeliveryPrice,
            calcuatedPayPrice:updatedPayPrice
          }
        })
        setLoading(false);
        loadingRef.current=false;
      }catch(error){
        setLoading(false);
        nav('/errorPage',{ replace: true });
      }
    }
    useEffect(() => {
        init();
        const script = document.createElement('script');
        script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        script.onload = () => {
          setPostcodeRoading(true);
        };
        document.body.appendChild(script);
        return () => {
          document.body.removeChild(script);
        };
      }, []);
      const handleOpenPostSearch = () => {
        if(!postcodeRoading){
          alert('우편번호 서비스 불러오는 중... 잠시 기다려주세요');
        }
        try{
          new (window as any).daum.Postcode({
            oncomplete: function (data: any) {
                  setOrderCheckoutScreenData(prev=>{
                    return {
                      ...prev,
                      postcode:data.zonecode,
                      roadAddress:data.roadAddress,
                      jibunAddress:data.jibunAddress,
                    }
                  });
            }
          }).open();
        }catch(error){
          alert("우편번호 서비스에 에러발생했습니다, 잠시 후 다시 시도해주세요");
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
        try{
          const orderItemSaveRequest:OrderItemSaveRequest[]=transformOrderListToOrderItemSaveRequestList(orderCheckoutScreenData.orderList);
          const orderSaveRequest:OrderSaveRequest={orderSaveList:orderItemSaveRequest,postcode:orderCheckoutScreenData.postcode,
            roadAddress:orderCheckoutScreenData.roadAddress,jibunAddress:orderCheckoutScreenData.jibunAddress,detailAddress:orderCheckoutScreenData.detailAddress}
          const validationMessage=ValidateOrderSaveRequest(orderSaveRequest);
          if(validationMessage){
            alert(validationMessage);
            return;
          }
          if(loadingRef.current){return;}
          loadingRef.current=true;
          setLoading(true);
          const response=await axiosInstance.post('/api/order/save',orderSaveRequest);
          const cartCnt = await axiosInstance.post('/api/cart/list/count');
          alert("주문을 완료했습니다");
          setCartListCnt(cartCnt.data);
          setLoading(false);
          loadingRef.current=false;
          nav('/',{ replace: true });
        }catch(error:any){
          setLoading(false);
          if(error?.response?.status===400){
            alert(error.response.data);
            nav('/',{ replace: true });
          }else{
            console.log(error);
            nav('/errorPage',{ replace: true });
          }
        }
      }
    return(
        <div>
            <div className={styles.postContainer}>
                <h2>배송지 검색</h2>
                <input type="text" className={styles.postInput} id="postcode" placeholder="우편번호" onClick={handleOpenPostSearch} value={orderCheckoutScreenData.postcode} readOnly></input>
                <input type="button" className={styles.postInput} value="우편번호 찾기" onClick={handleOpenPostSearch} disabled={!postcodeRoading}></input><br></br>
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
                    <p>{updatedAllPrice.toLocaleString('ko-KR')}<span> 원</span></p>
                    </div>
                    <div className={styles.discountPrice}>
                    <p>할인금액</p>
                    <p>-{updatedAllDiscountPrice.toLocaleString('ko-KR')}<span> 원</span></p>
                    </div>
                    <div className={styles.deliveryPrice}>
                    <p>배송비</p>
                    <p>{updatedAllDeliveryPrice.toLocaleString('ko-KR')}<span> 원</span></p>
                    </div>
                    <div className={styles.payPrice}>
                    <h3>최종결제금액</h3>
                    <p>{updatedPayPrice.toLocaleString('ko-KR')}<span> 원</span></p>
                    </div>
                    <div className={styles.buttonGroup}>
                    <button className={styles.orderButton} onClick={handleBuy} disabled={loading}>주문하기</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default OrderCheckout;
