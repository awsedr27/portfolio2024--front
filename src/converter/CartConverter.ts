import { CartListResponse } from "../data/cart/CartResponse";
import { CartListScreenData } from "../pages/cart/list/CartListScreenData";

export const transformCartListResponse = (responseData: CartListResponse): CartListScreenData["cartList"] => {
    
    return responseData.cartList.map(item => ({
        checkBox:false,
        productId: item.productId,
        productName: item.productName,
        description:item.description,
        productUseYn:item.productUseYn,
        price:item.price,
        quantity:item.quantity,
        createDate: new Date(item.createDate)
    }));
};