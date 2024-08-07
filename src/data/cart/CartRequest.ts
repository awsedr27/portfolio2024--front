  export interface CartSaveRequest {
    productId:number;
  }
  export interface CartUpdateRequest {
    productId:number;
    quantity?:number;
  }
  export interface CartListDeleteRequest {
    productIdList:number[]
  }