export interface OrderCheckScreenData{
    orderList:OrderList[]
}
export interface OrderList{
    orderId: number;
    totalPrice: number;
    status: string;
    postcode: string;
    roadAddress: string;
    jibunAddress: string;
    detailAddress: string;
    createDate: Date; 
    orderItems: OrderItem[]; 
}

export interface OrderItem{
    orderItemId: number;
    imageUrl: string;
    productName: string;
    quantity: number;
    price: number;
    status: string;
    createDate: Date; 
}