import { useNavigate } from "react-router-dom";
import HistoriesInvoiceCardItem from "../../../components/card/HistoriesInvoiceCardItem";
import text from "../../../util/text";
import styles from "./HistoriesInvoice.module.css";
import classNames from "classnames";
import navigateToPage from "../../../config/navigate";

const ListInvoice = (props: any) => {
  const { invoiceHistory, role } = props;
  const navigate = useNavigate();
  if (!Array.isArray(invoiceHistory) || invoiceHistory.length === 0) {
    return (
      <div className={styles.emptyInvoice}>
        <p>
          {text[`PersonalPage.${role}.emptyInvoice` as keyof typeof text] ||
            "Không có hóa đơn nào"}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.invoiceList}>
      {invoiceHistory.map((invoice: any) => (
        <HistoriesInvoiceCardItem
          key={invoice.invoce._id}
          invoice={invoice.invoce}
          court={invoice.court}
          onViewDetail={() => console.log("View detail", invoice.id)}
          onPay={() => navigate(navigateToPage("PAYMENT", invoice.invoce._id))}
          onCancel={() => console.log("Cancel", invoice.id)}
        /> 
      ))}
    </div>
  );
};


export default function HistoriesInvoice(props: any) {
  const { mainElement, invoiceHistory, role } = props;
  const mainClass = classNames(styles.main, mainElement);

  return (
    <div className={mainClass}>
      <h2>Thông tin đặt sân của bạn</h2>
      <ListInvoice invoiceHistory={invoiceHistory} role={role} />
    </div>
  );
}
