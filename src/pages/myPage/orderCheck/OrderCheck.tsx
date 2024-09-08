import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from './OrderCheck.module.css'; 
import axiosInstance from "../../../network/Api";
import { OrderListRequest } from "../../../data/order/OrderRequest";
import { OrderCheckScreenData, OrderItem, OrderList } from "./OrderCheckScreenData";
import { OrderListResponse } from "../../../data/order/OrderResponse";
import { transformOrderListResultResponseToOrderCheckScreenData } from "../../../converter/OrderConverter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const OrderCheck: React.FC = () => {
    const nav = useNavigate();
    const location = useLocation();
    const [orderStatus, setOrderStatus] = useState('PENDING'); 
    const [orderCheckScreenData, setOrderCheckScreenData] = useState<OrderCheckScreenData>({orderList:[]});
    const imgLocation = process.env.REACT_APP_PRODUCT_IMG_LOCATION;
    const baseUrl = process.env.REACT_APP_API_URL;
    const lastRequestId = useRef(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const lastOrderIdRef = useRef<number | undefined>(undefined);
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

    const getOrderList=async (orderId?:number)=>{
        try{
            const request:OrderListRequest={status:orderStatus,orderId:orderId}
            const response = await axiosInstance.post('/api/order/list',request);
            const result:OrderListResponse=response.data;
            const orderList=transformOrderListResultResponseToOrderCheckScreenData(result.orderList);
            return orderList;
        }catch(error){
            nav('/errorPage',{ replace: true });
            return [];
        }
    }
    useEffect(() => {
        const requestId = ++lastRequestId.current;
        const loadInitialOrders = async () => {
            setLoading(true);
            setHasMore(true);
            const orderList=await getOrderList();               
            if (requestId === lastRequestId.current) {
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
                setLoading(false);
            }
        }
        loadInitialOrders();
      }, [orderStatus]);
    const handleButtonClick=(tab:string)=>{
        setOrderStatus(tab);
    }
    const handleToggle=(order:OrderList)=>{
        setExpandedOrderId(prevId => prevId === order.orderId ? null : order.orderId); 
    }
    const handleAddOrderList=()=>{

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
                                {(order.status==='PENDING')?<button>주문취소</button>:<span>취소불가</span>}
                            </div>
                          </div>
                          <div className={styles.information} onClick={() => handleToggle(order)}>
                                {(expandedOrderId !== order.orderId)&&
                                    (<div><FontAwesomeIcon icon={faChevronDown}/></div>)
                                }
                          </div>
                          {(expandedOrderId === order.orderId)&& (
                            <div className={styles.orderDetail}>
                                <div className={styles.orderItemContainer}>
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
                                                {(orderItem.status==='PENDING')?(<button>개별취소</button>):(<span>취소불가</span>)}
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