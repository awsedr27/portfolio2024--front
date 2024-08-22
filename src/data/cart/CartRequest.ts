  export interface CartSaveRequest {
    productId:number;
    quantity?:number;
  }
  export interface CartUpdateRequest {
    productId:number;
    quantity:number;
  }
  export interface CartListDeleteRequest {
    productIdList:number[]
  }
  export interface CartBuyNowRequest {
    productId:number;
    quantity:number;
  }
  export interface CartListForCheckoutRequest {
    productIdList:number[];
  }