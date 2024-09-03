import { CartListForCheckoutResponse, CartListResponse } from "../data/cart/CartResponse";
import { CartListScreenData } from "../pages/cart/list/CartListScreenData";
import { OrderCheckoutScreenData } from "../pages/order/checkout/OrderCheckoutScreenData";

export const transformCartListResponse = (responseData: CartListResponse): CartListScreenData["cartList"] => {
    
    return responseData.cartList.map(item => ({
        checkBox:false,
        productId: item.productId,
        productName: item.productName,
        description:item.description,
        productUseYn:item.productUseYn,
        price:item.price,
        quantity:item.quantity,
        imageUrl:item.imageUrl,
        createDate: new Date(item.createDate)
    }));
};

export const transformCartListForCheckoutResponse = (responseData: CartListForCheckoutResponse): OrderCheckoutScreenData["orderList"] => {
    return responseData.cartList.map(item => ({
        productId: item.productId,
        productName: item.productName,
        description:item.description,
        productUseYn:item.productUseYn,
        price:item.price,
        quantity:item.quantity,
        imageUrl:item.imageUrl,
        createDate: new Date(item.createDate)
    }));
};