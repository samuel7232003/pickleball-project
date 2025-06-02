import HistoriesInvoiceCardItem from "../../../components/card/HistoriesInvoiceCardItem";
import text from "../../../util/text";
import styles from "./HistoriesInvoice.module.css";
import classNames from "classnames";

export default function HistoriesInvoice(props: any) {
  const { mainElement, invoiceHistory, role } = props;

  const mainClass = classNames(styles.main, mainElement);

  const ListInvoice = () => {
    return (
      <div className={styles.invoiceList}>
        {invoiceHistory.map((invoice: any) => (
          <HistoriesInvoiceCardItem
            key={invoice.id}
            data={invoice}
            onViewDetail={() => console.log("View detail", invoice.id)}
            onPay={() => console.log("Pay", invoice.id)}
            onCancel={() => console.log("Cancel", invoice.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={mainClass}>
      <h2>Thông tin đặt sân của bạn</h2>
      <div className={styles.invoiceList}>
        {invoiceHistory.length > 0 ? (
          <ListInvoice />
        ) : (
          <div className={styles.emptyInvoice}>
            <p>
              {text[`PersonalPage.${role}.emptyInvoice` as keyof typeof text]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
