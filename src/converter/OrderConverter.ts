import { OrderItemSaveRequest, OrderSaveRequest } from "../data/order/OrderRequest";
import { MyPageReviewItemResponse } from "../data/order/OrderResponse";
import { MyPageReviewListScreenData } from "../pages/myPage/review/list/MyPageReviewListScreenData";
import { OrderCheckoutItem } from "../pages/order/checkout/OrderCheckoutScreenData";

export const transformOrderListToOrderItemSaveRequestList = (param:OrderCheckoutItem[] ): OrderItemSaveRequest[] => {
    const orderSaveList: OrderItemSaveRequest[] = param.map(item => ({
        productId: item.productId,
        quantity: item.quantity
    }));

    return  orderSaveList ;
};
export const transformMyPageReviewListResponseToMyPageReviewListScreenData = (param:MyPageReviewItemResponse[] ): MyPageReviewListScreenData['myPageReviewList'] => {
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