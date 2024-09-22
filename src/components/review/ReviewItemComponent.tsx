import React from 'react';
import { ReviewItem } from './ReviewItemComponentScreenData';
import styles from './ReviewItemComponent.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';




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
      </div>
      <div className={styles.reviewCreateDateAndNickname}>
        <div className={styles.reviewNickname}>
        <FontAwesomeIcon className={styles.userIcon} icon={faUser}/>

          {props.reviewItem.nickname}
        </div>
        <div className={styles.reviewCreateDate}>
          {props.reviewItem.createDate.toLocaleDateString()}
        </div>
      </div>
      <div className={styles.reviewTextContainer}>
        <div className={styles.reviewComment}>
          {props.reviewItem.comment}
        </div>
        {(props.reviewItem.reply)&&(
        <div className={styles.reviewReply}>
          답변 : {props.reviewItem.reply}
        </div>)}
      </div>
    </div>
  );
};

export default ReviewItemComponent;
