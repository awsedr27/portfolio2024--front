export interface CategoryListResponse {
    categoryList:CategoryItemResponse[]
  }
  export interface CategoryItemResponse {
    categoryId: number;
    name: string;
    description: string;
    useYn: number;
    createDate: string; 
    modifyDate: string; 
  }