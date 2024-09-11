import { CartItem } from "../../../components/cart/CartItemComponentScreenData";

export interface CartListScreenData {
    cartList:CartItem[];
    calcuatedAllPrice:number;
    calcuatedAllDiscountPrice:number;
    calcuatedPayPrice:number;
    isAllSelect:boolean;
  }