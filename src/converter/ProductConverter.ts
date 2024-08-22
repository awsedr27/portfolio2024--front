import { ProductDetailResponse, ProductListResponse } from "../data/product/ProductResponse";
import { MainScreenData } from "../pages/MainScreenData";
import { ProductDetailScreenData } from "../pages/product/detail/ProductDetailScreenData";

export const transformProductListResponse = (responseData: ProductListResponse): MainScreenData["productList"] => {
    
    return responseData.productList.map(item => ({
        productId: item.productId,
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId: item.categoryId,
        imageUrl:item.imageUrl,
        createDate: item.createDate,
    }));
};

export const transformProductDetailResponse = (responseData: ProductDetailResponse): ProductDetailScreenData => {
    return {
        productId: responseData.productId,
        name: responseData.name,
        description: responseData.description,
        price: responseData.price,
        categoryName: responseData.categoryName,
        imageUrl:responseData.imageUrl,
        createDate: new Date(responseData.createDate),
        caculatedPrice:responseData.price
      };
};