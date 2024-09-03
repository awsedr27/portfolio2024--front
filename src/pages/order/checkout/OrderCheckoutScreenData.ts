export interface OrderCheckoutScreenData{
    orderList:OrderCheckoutItem[];
    calcuatedAllPrice:number;
    calcuatedAllDiscountPrice:number;
    calcuatedAllDeliveryPrice:number;
    calcuatedPayPrice:number;
    postcode: string;
    roadAddress: string;
    jibunAddress: string;
    detailAddress: string;
}
export interface OrderCheckoutItem{
    productId: number;
    productName: string;
    description:string;
    productUseYn:string;
    price:number;
    quantity: number;
    imageUrl:string;
    createDate: Date;
}
