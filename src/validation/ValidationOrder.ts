import { OrderSaveRequest } from "../data/order/OrderRequest";


const ValidateOrderSaveRequest = (orderSaveRequest: OrderSaveRequest): string|undefined => {


    if (!orderSaveRequest.postcode || !/^\d{5,6}$/.test(orderSaveRequest.postcode)) {
        return '우편번호는 5~6자리의 숫자로 입력해야 합니다.';
    }


    if (!orderSaveRequest.roadAddress) {
        return '도로명 주소는 필수 입력 사항입니다.';
    }


    if (!orderSaveRequest.jibunAddress) {
        return '지번 주소는 필수 입력 사항입니다.'
    }


    if (!orderSaveRequest.detailAddress) {
        return '상세 주소는 필수 입력 사항입니다.';
    }

 
    if (!orderSaveRequest.orderSaveList || orderSaveRequest.orderSaveList.length === 0) {
        return '주문 목록은 필수 사항이며, 최소한 하나의 항목이 필요합니다.';
    } else {
        orderSaveRequest.orderSaveList.forEach((item, index) => {

            if (item.productId <= 0) {
                return `주문 항목 ${index + 1}의 제품 ID는 1 이상의 숫자여야 합니다.`;
            }

            if (item.quantity <= 0) {
                return `주문 항목 ${index + 1}의 수량은 1 이상의 숫자여야 합니다.`;
            }
        });
    }
    return;
};

export default ValidateOrderSaveRequest;
