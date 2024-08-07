import React, { useState } from 'react';
import styles from './CartItemComponent.module.css';
import { CartItem } from './CartItemComponentScreenData';

interface CartItemProps {
    cartItem: CartItem;
    onUpdateQuantity:(productId:number,quantity:number)=>void;
    onCheckboxChange:(productId:number,isChecked:boolean)=>void;
  }

const CartItemComponent: React.FC<CartItemProps> = (props:CartItemProps) => {


  return (
    <li className={styles.item}>
      <input
        type="checkbox"
        onChange={(e) => props.onCheckboxChange(props.cartItem.productId,e.target.checked)}
      />
      <div className={styles.itemName}>{props.cartItem.productName}</div>
      <div className={styles.itemQuantity}>Quantity: {props.cartItem.quantity}</div>
      <div className={styles.itemDate}>
        Added on: {new Date(props.cartItem.createDate).toLocaleString()}
      </div>
      <div className={styles.quantityControls}>
        <button className={styles.button} onClick={()=>{props.onUpdateQuantity(props.cartItem.productId,props.cartItem.quantity-1)}}>-</button>
        <span>{props.cartItem.quantity}</span>
        <button className={styles.button} onClick={()=>{props.onUpdateQuantity(props.cartItem.productId,props.cartItem.quantity+1)}}>+</button>
      </div>
    </li>
  );
};

export default CartItemComponent;
