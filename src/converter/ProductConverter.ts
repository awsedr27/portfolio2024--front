import { ProductListResponse } from "../data/product/ProductResponse";
import { MainScreenData } from "../pages/MainScreenData";

export const transformProductListResponse = (responseData: ProductListResponse): MainScreenData["productList"] => {
    
    return responseData.productList.map(item => ({
        productId: item.productId,
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId: item.categoryId,
        createDate: item.createDate,
    }));
};