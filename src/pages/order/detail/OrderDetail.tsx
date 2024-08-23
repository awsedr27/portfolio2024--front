import { useLocation } from "react-router-dom";
import { OrderDetailScreenData } from "./OrderDetailScreenData";
import { useEffect, useState } from "react";
import styles from './OrderDetail.module.css'; 
import axiosInstance from "../../../network/Api";
import { CartListForCheckoutRequest } from "../../../data/cart/CartRequest";
import { CartListForCheckoutResponse } from "../../../data/cart/CartResponse";
import { transformCartListForCheckoutResponse } from "../../../converter/CartConverter";

const OrderDetail: React.FC = () => {
    const location = useLocation();
    const orderListParam: number[] = location.state?.orderList || [];
    const imgLocation = process.env.REACT_APP_PRODUCT_IMG_LOCATION;
    const baseUrl = process.env.REACT_APP_API_URL;
    const [orderDetailScreenData, setOrderDetailScreenData] = useState<OrderDetailScreenData>({orderList:[],postcode:"",roadAddress:"",jibunAddress:"",detailAddress:"",
      calcuatedAllPrice:0,calcuatedPayPrice:0,calcuatedAllDiscountPrice:0,calcuatedAllDeliveryPrice:0
    });
    const [loading, setLoading] = useState(false);
    const [buy, setBuy] = useState(false);
    const fetchCartData = async () => {
      const cartListForCheckoutRequest:CartListForCheckoutRequest={productIdList:orderListParam};
      const response=await axiosInstance.post('api/cart/list/checkout',cartListForCheckoutRequest);
      const resultData:CartListForCheckoutResponse = response.data;
      const orderList=transformCartListForCheckoutResponse(resultData);
      setOrderDetailScreenData(prev=>{
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
          console.log('Script not loaded yet.');
          return;
        }
        try{
          new (window as any).daum.Postcode({
            oncomplete: function (data: any) {
              const allDeliveryPrice=4000;
                  setOrderDetailScreenData(prev=>{
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
        setOrderDetailScreenData(prev=>{
          return {
            ...prev,
            detailAddress:event.target.value
          }
        });
      }
      const handleBuy=async ()=>{
        
      }
    return(
        <div>
            <div className={styles.postContainer}>
                <h2>배송지 검색</h2>
                <input type="text" className={styles.postInput} id="postcode" placeholder="우편번호" onClick={handleOpenPostSearch} value={orderDetailScreenData.postcode} readOnly></input>
                <input type="button" className={styles.postInput} value="우편번호 찾기" onClick={handleOpenPostSearch} disabled={!loading}></input><br></br>
                <input type="text" className={styles.postInput} id="roadAddress" placeholder="도로명주소" value={orderDetailScreenData.roadAddress} readOnly></input>
                <input type="text" className={styles.postInput} id="jibunAddress" placeholder="지번주소" value={orderDetailScreenData.jibunAddress} readOnly></input>
                <span id="guide" style={{ color: "#999", display: "none" }}></span>
                <input type="text" className={styles.postInput} id="detailAddress" placeholder="상세주소" onChange={handleInputDetailAddress}></input>
            </div>
            <div className={styles.orderContainer}>
                <div className={styles.orderedProductContainer}>
                  <h4>주문 상품</h4>
                  <div className={styles.imageContainer}>
                    {orderDetailScreenData.orderList.map((item,index)=>
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
                    <p>{orderDetailScreenData.calcuatedAllPrice.toLocaleString('ko-KR')}<span> 원</span></p>
                    </div>
                    <div className={styles.discountPrice}>
                    <p>할인금액</p>
                    <p>-{orderDetailScreenData.calcuatedAllDiscountPrice.toLocaleString('ko-KR')}<span> 원</span></p>
                    </div>
                    <div className={styles.deliveryPrice}>
                    <p>배송비</p>
                    <p>{orderDetailScreenData.calcuatedAllDeliveryPrice.toLocaleString('ko-KR')}<span> 원</span></p>
                    </div>
                    <div className={styles.payPrice}>
                    <h3>최종결제금액</h3>
                    <p>{orderDetailScreenData.calcuatedPayPrice.toLocaleString('ko-KR')}<span> 원</span></p>
                    </div>
                    <div className={styles.buttonGroup}>
                    <button className={styles.orderButton} onClick={handleBuy} disabled={buy}>주문하기</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default OrderDetail;
