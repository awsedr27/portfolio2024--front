import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from './OrderCheck.module.css'; 
import axiosInstance from "../../../network/Api";
import { OrderCancelRequest, OrderItemCancelRequest, OrderListRequest } from "../../../data/order/OrderRequest";
import { OrderCheckScreenData, OrderItem, OrderList } from "./OrderCheckScreenData";
import { OrderListResponse } from "../../../data/order/OrderResponse";
import { transformOrderListResultResponseToOrderCheckScreenData } from "../../../converter/OrderConverter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useSpinner } from "../../../context/SpinnerContext";

const OrderCheck: React.FC = () => {
    const nav = useNavigate();
    const location = useLocation();
    const [orderStatus, setOrderStatus] = useState('PENDING'); 
    const [orderCheckScreenData, setOrderCheckScreenData] = useState<OrderCheckScreenData>({orderList:[]});
    const imgLocation = process.env.REACT_APP_PRODUCT_IMG_LOCATION;
    const baseUrl = process.env.REACT_APP_API_URL;
    //const lastRequestId = useRef(0);
    const [hasMore, setHasMore] = useState(true);
    const {loading,setLoading } = useSpinner();
    const loadingRef = useRef(false);
    const lastOrderIdRef = useRef<number | undefined>(undefined);
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

    const getOrderList=async (orderId?:number)=>{
        const request:OrderListRequest={status:orderStatus,orderId:orderId}
        const response = await axiosInstance.post('/api/order/list',request);
        const result:OrderListResponse=response.data;
        const orderList=transformOrderListResultResponseToOrderCheckScreenData(result.orderList);
        return orderList;
    }
    const init = async () => {
        try{
            if(loadingRef.current){return;}
            loadingRef.current=true;
            setLoading(true);
            setHasMore(true);
            const orderList=await getOrderList();  
            if(orderList.length<5){
                setHasMore(false);
            }
            setOrderCheckScreenData(prev=>{
                if(orderList.length>0){
                    lastOrderIdRef.current=orderList[orderList.length-1].orderId;
                }
                return({
                    orderList:orderList
                })
            });  
            setExpandedOrderId(null);
            setLoading(false);
            loadingRef.current=false;
        }catch(error){
            setLoading(false);
            nav('/errorPage',{ replace: true });
        }
    }
    useEffect(() => {
        init();
      }, [orderStatus]);
    const handleButtonClick=(tab:string)=>{
        setOrderStatus(tab);
    }
    const handleToggle=(order:OrderList)=>{
        setExpandedOrderId(prevId => prevId === order.orderId ? null : order.orderId); 
    }
    const handleAddOrderList=async ()=>{
        try{
            if(loadingRef.current){return;}
            loadingRef.current=true;
            setLoading(true);
            const orderList=await getOrderList(lastOrderIdRef.current);               
            if(orderList.length<5){
                setHasMore(false);
            }
            setOrderCheckScreenData(prev=>{
                if(orderList.length>0){
                    lastOrderIdRef.current=orderList[orderList.length-1].orderId;
                }
                return({
                    orderList:[...prev.orderList,...orderList]
                })
            });
            setLoading(false);
            loadingRef.current=false;
        }catch(error){
            setLoading(false);
            nav('/errorPage',{ replace: true });
        }
    }
    const changeStatusText=(status:string)=>{
        switch (status) {
            case 'PENDING':
              return '주문 접수 (취소 가능)';
            case 'PROCESSING':
              return '처리 중';
            case 'SHIPPED':
              return '배송중';
            case 'COMPLETED':
              return '배송 완료';
            case 'CANCELLED':
              return '주문 취소';
            default:
              return '상태 없음';
          }
    }
    const handleOrderCancel=async (orderId:number)=>{
        try{
            const userConfirmed = window.confirm('주문을 취소하시겠습니까?');
            if (userConfirmed) {
                if(loadingRef.current){return;}
                loadingRef.current=true;
                setLoading(true);
                const orderCancelRequest:OrderCancelRequest={orderId:orderId};
                const response = await axiosInstance.post('/api/order/cancel',orderCancelRequest);
                alert("주문을 취소했습니다");
                setLoading(false);
                loadingRef.current=false;
                init();
            } else {
                return;
            }
        }catch(error){
            setLoading(false);
            nav('/errorPage',{ replace: true });
        }
    }
    const handleOrderItemCancel=async (orderId:number,orderItemId:number)=>{
        try{
            const userConfirmed = window.confirm('주문상품을 개별취소하시겠습니까?');
            if (userConfirmed) {
                if(loadingRef.current){return;}
                loadingRef.current=true;
                setLoading(true);
                const orderItemCancelRequest:OrderItemCancelRequest={orderId:orderId,orderItemId:orderItemId};
                const response = await axiosInstance.post('/api/order/orderItem/cancel',orderItemCancelRequest);
                alert("주문상품을 개별취소했습니다");
                setLoading(false);
                loadingRef.current=false;
                init();
              } else {
                return;
              }
        }catch(error){
            setLoading(false);
            nav('/errorPage',{ replace: true });        
        }
    }
   return(
    <div className={styles.orderCheckContainer}>
        <div className={styles.headerTitle}><h2>주문확인/주문취소</h2></div>
        <div className={styles.headerSubTitle}><p>* 주문취소는 접수상태에서만 가능합니다</p></div>
        <div className={styles.orderStatusBtnContainer}>
        <button
                className={`${styles.orderButton} ${orderStatus === 'PENDING' ? styles.active : ''}`}
                onClick={() => handleButtonClick('PENDING')}
            >
                주문 접수 (취소 가능)
            </button>
            <button
                className={`${styles.orderButton} ${orderStatus === 'PROCESSING' ? styles.active : ''}`}
                onClick={() => handleButtonClick('PROCESSING')}
            >
                처리 중
            </button>
            <button
                className={`${styles.orderButton} ${orderStatus === 'SHIPPED' ? styles.active : ''}`}
                onClick={() => handleButtonClick('SHIPPED')}
            >
                배송중
            </button>
            <button
                className={`${styles.orderButton} ${orderStatus === 'COMPLETED' ? styles.active : ''}`}
                onClick={() => handleButtonClick('COMPLETED')}
            >
                배송 완료
            </button>
            <button
                className={`${styles.orderButton} ${orderStatus === 'CANCELLED' ? styles.active : ''}`}
                onClick={() => handleButtonClick('CANCELLED')}
            >
                주문 취소
            </button>
        </div>
        {loading?(
            <div className={styles.loadingContainer}>
                <p>Loading...</p>
            </div>
            ):(
                orderCheckScreenData.orderList.length === 0 ? (
                    <div className={styles.noOrderList}><span>주문이 없습니다</span></div> 
            ) : (
                <div className={styles.orderListContainer}>
                    <div className={styles.headerTitleContainer}>
                        <span className={styles.headerSpan}>주문일자</span>
                        <span className={styles.headerSpan}>주문번호</span>
                        <span className={styles.headerProductName}>주문내역</span>
                        <span className={styles.headerPrice}>결제금액</span>
                        <span className={styles.headerSpan}>취소</span>
                    </div>
                    {orderCheckScreenData.orderList.map((order) => (
                        <div className={styles.orderListBox} key={order.orderId}>
                          <div className={styles.content}>
                            <div className={styles.createDate}>{order.createDate.toLocaleDateString()}</div>
                            <div className={styles.orderId}>{order.orderId}</div>
                            <div className={styles.productNameAndInformation}>
                                <div className={styles.productNameContainer}>
                                    <div className={styles.productName}>
                                        <span>{order.orderItems.at(0)?.productName}</span>
                                    </div>
                                    <div className={styles.productNamePlus}>{(order.orderItems.length>=2)&&(<span>외 {order.orderItems.length-1}개</span>)}</div>
                                </div>
                            </div>
                            <div className={styles.price}>{order.totalPrice.toLocaleString('ko-KR')}원</div>
                            <div className={styles.cancelBtn}>
                                {(!order.orderItems.some(item => (item.status !== 'PENDING') && (item.status !== 'CANCELLED')))&&(order.status==='PENDING')?<button onClick={()=>{handleOrderCancel(order.orderId)}}>주문취소</button>:<span>취소불가</span>}
                            </div>
                          </div>
                          {(expandedOrderId !== order.orderId)&&
                            (<div className={styles.orderAction} onClick={() => handleToggle(order)}><FontAwesomeIcon icon={faChevronDown}/></div>)
                          }

                          {(expandedOrderId === order.orderId)&& (
                            <div className={styles.orderDetail}>
                                <div className={styles.orderItemContainer}>
                                    <div className={styles.expandedTitle}>
                                        <span className={styles.expandedImg}>상품이미지</span>
                                        <span className={styles.expandedName}>상품이름</span>
                                        <span className={styles.expandedPrice}>가격</span>
                                        <span className={styles.expandedQuantity}>수량</span>
                                        <span className={styles.expandedStatus}>주문상태</span>
                                        <span className={styles.expandedCancel}>취소</span>
                                    </div>
                                    {order.orderItems.map(orderItem=>(
                                        <div className={styles.orderItemBox}>
                                                <div className={styles.orderItemImg}>
                                                    {orderItem.imageUrl? (
                                                    <img src={`${baseUrl}${imgLocation}${orderItem.imageUrl}`} alt={orderItem.productName} />
                                                    ) : (
                                                    <p>이미지 없음</p>
                                                    )}
                                                </div>  
                                            <div className={styles.orderItemName}>{orderItem.productName}</div>
                                            <div className={styles.orderItemPrice}>{orderItem.price.toLocaleString('ko-KR')}원</div>
                                            <div className={styles.orderItemQuantity}>x {orderItem.quantity}</div>
                                            <div className={styles.orderItemStatus}>{changeStatusText(orderItem.status)}</div>
                                            <div className={styles.orderItemCancelBtn}>
                                                {(orderItem.status==='PENDING')?(<button onClick={()=>handleOrderItemCancel(order.orderId,orderItem.orderItemId)}>개별취소</button>):(<span>취소불가</span>)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.orderAction} onClick={() => handleToggle(order)}>
                                    <FontAwesomeIcon icon={faChevronUp}/>
                                </div>
                            </div>
                        )}
                        </div>
                    ))}
                <div className={styles.addButton}>
                    {hasMore&&<button disabled={loading} onClick={handleAddOrderList}>더보기</button>}
                </div>
                </div>
                
            )
        )
        }
    </div>
    )
}
export default OrderCheck;