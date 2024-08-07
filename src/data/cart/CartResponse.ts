  export interface CartSaveResponse {
    quantity:number;
  }
  export interface CartListResponse {
    cartList:CartItemResponse[];
  }
  interface CartItemResponse{
    productId:number;
    productName:string;
    quantity:number;
    createDate:string;
  }
  export interface CartUpdateResponse {
    quantity:number;
  }