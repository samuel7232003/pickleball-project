import React from 'react';
import styles from './HistoriesInvoiceCardItem.module.css';

interface InvoiceData {
  id: string;
  courtName: string;
  address: string;
  sessions: number;
  price: number;
  status: 'pending' | 'completed';
  date: string;
}

interface Props {
  data: InvoiceData;
  onViewDetail?: () => void;
  onPay?: () => void;
  onCancel?: () => void;
}

export default function HistoriesInvoiceCardItem(props: any){
  const { data, onViewDetail, onPay, onCancel } = props;
  return (
    <div className={styles.container}>
      <div className={styles.courtInfo}>
        <img 
          src={`/court-images/${data.id}.jpg`} 
          alt={data.courtName}
          className={styles.courtImage}
        />
        <div className={styles.details}>
          <h3>{data.courtName}</h3>
          <p className={styles.address}>{data.address}</p>
        </div>
      </div>
      
      <div className={styles.bookingInfo}>
        <div className={styles.sessions}>
          <span className={styles.icon}>🕒</span>
          <span>{data.sessions} xuất</span>
        </div>
        <div className={styles.price}>
          <span>{data.price.toLocaleString()} VND</span>
        </div>
      </div>

      <div className={styles.actions}>
        {data.status === 'pending' ? (
          <>
            <button 
              className={`${styles.button} ${styles.payButton}`}
              onClick={onPay}
            >
              Thanh toán
            </button>
            <button 
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={onCancel}
            >
              Huỷ
            </button>
          </>
        ) : (
          <button 
            className={`${styles.button} ${styles.viewButton}`}
            onClick={onViewDetail}
          >
            Xem chi tiết
          </button>
        )}
      </div>
    </div>
  );
}; 