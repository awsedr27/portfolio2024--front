export interface OrderCheckoutScreenData{
    orderList:OrderCheckoutItem[];
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
