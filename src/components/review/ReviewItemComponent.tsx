import React from 'react';
import { ReviewItem } from './ReviewItemComponentScreenData';
import styles from './ReviewItemComponent.module.css';




interface ReviewItemProps {
  reviewItem: ReviewItem;
}

const ReviewItemComponent: React.FC<ReviewItemProps> = (props:ReviewItemProps) => {
    
    function Star({ filled }: { filled: boolean }) {
        return (
          <span style={{ color: filled ? 'gold' : 'lightgray', fontSize: '24px' }}>
            {'\u2605'}
          </span>
        );
      }

  return (
    <div className={styles.reviewItem}>
      <div className={styles.headerContainer}>
        <div className={styles.reviewRatingContainer}>
          {Array.from({ length: 5 }, (_, index) => (
              <Star key={index} filled={index < props.reviewItem.rating} />
          ))}
        </div>
        <div className={styles.reviewCreateDate}>
          {props.reviewItem.createDate.toLocaleDateString()}
        </div>
      </div>
        <div className={styles.reviewUserName}>
          {props.reviewItem.userName}
        </div>
        <div className={styles.reviewComment}>
          {props.reviewItem.comment}
        </div>
        <div className={styles.reviewReply}>
          {props.reviewItem.reply}
        </div>
    </div>
  );
};

export default ReviewItemComponent;
