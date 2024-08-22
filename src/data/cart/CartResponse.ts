  export interface CartSaveResponse {
    quantity:number;
  }
  export interface CartListResponse {
    cartList:CartItemResponse[];
  }
  interface CartItemResponse{
    productId:number;
    productName:string;
    description:string;
    productUseYn:string;
    quantity:number;
    price:number;
    imageUrl:string;
    createDate:string;
  }
  export interface CartUpdateResponse {
    quantity:number;
  }

  export interface CartListForCheckoutResponse {
    cartList:CartItemForCheckoutResponse[];
  }
  interface CartItemForCheckoutResponse{
    productId:number;
    productName:string;
    description:string;
    productUseYn:string;
    quantity:number;
    price:number;
    imageUrl:string;
    createDate:string;
  }