import { OrderItemSaveRequest, OrderSaveRequest } from "../data/order/OrderRequest";
import { MyPageReviewItemResponse, OrderListResponse, OrderListResultResponse } from "../data/order/OrderResponse";
import { OrderList } from "../pages/myPage/orderCheck/OrderCheckScreenData";
import { MyPageReviewListScreenData } from "../pages/myPage/review/list/MyPageReviewListScreenData";
import { OrderCheckoutItem } from "../pages/order/checkout/OrderCheckoutScreenData";

export const transformOrderListToOrderItemSaveRequestList = (param:OrderCheckoutItem[] ): OrderItemSaveRequest[] => {
    const orderSaveList: OrderItemSaveRequest[] = param.map(item => ({
        productId: item.productId,
        quantity: item.quantity
    }));

    return  orderSaveList ;
};
export const transformMyPageReviewListResponseToMyPageReviewListScreenData = (param:MyPageReviewItemResponse[]): MyPageReviewListScreenData['myPageReviewList'] => {
    return param.map(item => ({
        imageUrl:item.imageUrl,
        productName:item.productName,
        quantity:item.quantity,
        price: item.price*item.quantity,
        reviewId: item.reviewId,
        reviewUseYn: item.reviewUseYn,
        reviewRating:item.reviewRating,
        reviewComment:item.reviewComment,
        reviewReply: item.reviewReply,
        orderItemId: item.orderItemId,
        orderItemCreateData:new Date(item.orderItemCreateDate)
    }));
};

export const transformOrderListResultResponseToOrderCheckScreenData=(param:OrderListResultResponse[]):OrderList[]=>{
    return param.map(order => ({
        orderId: order.orderId,
        totalPrice: order.totalPrice,
        status: order.status,
        postcode: order.postcode,
        roadAddress: order.roadAddress,
        jibunAddress: order.jibunAddress,
        detailAddress: order.detailAddress,
        createDate: new Date(order.createDate), 
        orderItems: order.orderItems.map(item => ({
            orderItemId: item.orderItemId,
            imageUrl: item.imageUrl,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            status: item.status,
            createDate: new Date(item.createDate)
        }))
    }));

}