export interface OrderDetailScreenData{
    orderList:orderItem[];
    calcuatedAllPrice:number;
    calcuatedAllDiscountPrice:number;
    calcuatedAllDeliveryPrice:number;
    calcuatedPayPrice:number;
    postcode: string;
    roadAddress: string;
    jibunAddress: string;
    detailAddress: string;
}
interface orderItem{
    productId: number;
    productName: string;
    description:string;
    productUseYn:string;
    price:number;
    quantity: number;
    imageUrl:string;
    createDate: Date;
}
