import React, { useState } from 'react';
import styles from './CartItemComponent.module.css';
import { CartItem } from './CartItemComponentScreenData';
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
interface CartItemProps {
    cartItem: CartItem;
    onUpdateQuantity:(productId:number,quantity:number)=>void;
    onCheckboxChange:(productId:number)=>void;
    onClickCart:(productId:number)=>void;
  }

const CartItemComponent: React.FC<CartItemProps> = (props:CartItemProps) => {
  const imgLocation = process.env.REACT_APP_PRODUCT_IMG_LOCATION;
  const baseUrl = process.env.REACT_APP_API_URL;

  return (
    <tr className={styles.item}>
      <td className={styles.productContents}>
        <div className={`${styles.checkBoxStyle} ${props.cartItem.checkBox ? styles.checked:styles.unchecked}`}
        >
        <FontAwesomeIcon
          icon={faSquareCheck}
          onClick={() => props.onCheckboxChange(props.cartItem.productId)}
          />
        </div>
        <div className={styles.itemImage} onClick={()=>{props.onClickCart(props.cartItem.productId)}}>
          {/* <img src="../logo192.png"></img> */}
          {props.cartItem.imageUrl ? (
            <img src={`${baseUrl}${imgLocation}${props.cartItem.imageUrl}`} alt={props.cartItem.productName} />
          ) : (
            <p>이미지없음</p>
          )}
        </div>
        <div className={styles.itemContents} onClick={()=>{props.onClickCart(props.cartItem.productId)}}>
          <p>{props.cartItem.productName}</p>
          <p className={styles.itemDescription}>{props.cartItem.description}</p>
        </div>
      </td>
      <td>
        <div className={styles.itemPrice}>{props.cartItem.price.toLocaleString('ko-KR')}원</div>
      </td>
      <td>
        <div className={styles.quantityControl}>
          <button className={styles.button} onClick={()=>{props.onUpdateQuantity(props.cartItem.productId,props.cartItem.quantity-1)}}>-</button>
          <p>{props.cartItem.quantity}</p>
          <button className={styles.button} onClick={()=>{props.onUpdateQuantity(props.cartItem.productId,props.cartItem.quantity+1)}}>+</button>
        </div>
      </td>
    </tr>
  );
};

export default CartItemComponent;
