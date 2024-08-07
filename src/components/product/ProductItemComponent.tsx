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

  const handleCartClick = (event: React.MouseEvent) => {
    event.stopPropagation(); 
    props.onCartSaveClick(props.productItem.productId);
  };
  return (
    <div className={styles.productItem} onClick={() =>props.onClick(props.productItem.productId)}>
      <div className={styles.imageContainer}>
        <img src="logo192.png" alt={props.productItem.name} />
        <FontAwesomeIcon className={styles.cartIcon} icon={faShoppingCart} onClick={handleCartClick}/>
      </div>
      <h3>{props.productItem.name}</h3>
      <p>{props.productItem.productId}</p>
      <p>{props.productItem.description}</p>
      <p className={styles.price}>{props.productItem.price}</p>
    </div>
  );
};

export default ProductItemComponent;
