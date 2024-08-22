// ProductItem.tsx
import React from 'react';
import { ProductItem } from './ProductItemComponentData';
import styles from './ProductItemComponent.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';




interface ProductItemProps {
  productItem: ProductItem;
  onClick: (productId: number) => void;
  onCartSaveClick: (productId: number) => void;
}

const ProductItemComponent: React.FC<ProductItemProps> = (props:ProductItemProps) => {
  const imgLocation = process.env.REACT_APP_PRODUCT_IMG_LOCATION;
  const baseUrl = process.env.REACT_APP_API_URL;
  const handleCartClick = (event: React.MouseEvent) => {
    event.stopPropagation(); 
    props.onCartSaveClick(props.productItem.productId);
  };
  return (
    <div className={styles.productItem} onClick={() =>props.onClick(props.productItem.productId)}>
      <div className={styles.imageContainer}>
        {props.productItem.imageUrl ? (
          <img src={`${baseUrl}${imgLocation}${props.productItem.imageUrl}`} alt={props.productItem.name} />
        ) : (
          <p>이미지 준비 중</p>
        )}
        {/* <img 
            src={props.productItem.imageUrl ?`${baseUrl}${imgLocation}${props.productItem.imageUrl}` : "logo192.png"} 
            alt={props.productItem.name} 
        /> */}
        <FontAwesomeIcon className={styles.cartIcon} icon={faShoppingCart} onClick={handleCartClick}/>
      </div>
      <h3>{props.productItem.name}</h3>
      {/* <p>{props.productItem.productId}</p> */}
      <p>{props.productItem.description}</p>
      <p className={styles.price}>{props.productItem.price.toLocaleString('ko-KR')}원</p>
    </div>
  );
};

export default ProductItemComponent;
