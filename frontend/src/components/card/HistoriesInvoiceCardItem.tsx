import styles from './HistoriesInvoiceCardItem.module.css';
import { getImageCourt } from '../../util/getAssets';
import { invoiceStatus } from '../../common/constants';
import text from '../../util/text';

export default function HistoriesInvoiceCardItem(props: any){
  const { court, invoice, onViewDetail, onPay, onCancel } = props;

  const getStatusColor = (status: string) => {
    switch (status) {
      case invoiceStatus.PENDING:
        return styles.pending;
      case invoiceStatus.WAITING:
        return styles.waiting;
      case invoiceStatus.PAID:
        return styles.paid;
      case invoiceStatus.EXPIRED:
        return styles.expired;
      default:
        return styles.default;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.courtInfo}>
        <img 
          src={getImageCourt(court.images[0].url)} 
          alt=""
          className={styles.courtImage}
        />
        <div className={styles.details}>
          <h3>{court.name}</h3>
          <p className={styles.address}>{court.location}</p>
        </div>
      </div>
      
      <div className={styles.bookingInfo}>
        <div className={styles.price}>
          <span>{invoice.amount.toLocaleString()} VND</span>
        </div>
        <div className={`${styles.statusTag} ${getStatusColor(invoice.paymentStatus)}`}>
          {text[`PersonalPage.status.${invoice.paymentStatus}` as keyof typeof text]}
        </div>
      </div>

      <div className={styles.actions}>
        {invoice.paymentStatus === invoiceStatus.PENDING || invoice.paymentStatus === invoiceStatus.WAITING ? (
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