import { useNavigate } from "react-router-dom";
import HistoriesInvoiceCardItem from "../../../components/card/HistoriesInvoiceCardItem";
import text from "../../../util/text";
import styles from "./HistoriesInvoice.module.css";
import classNames from "classnames";
import navigateToPage from "../../../config/navigate";
import { pages } from "../../../router";

const ListInvoice = (props: any) => {
  const { invoiceHistory, role, onCancel } = props;
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

  const handleCancel = (invoiceId: string) => {
    onCancel(invoiceId);
  }

  return (
    <div className={styles.invoiceList}>
      {invoiceHistory.map((invoice: any) => (
        <HistoriesInvoiceCardItem
          key={invoice.invoce._id}
          invoice={invoice.invoce}
          court={invoice.court}
          onViewDetail={() => navigate(navigateToPage(pages.PAYMENT_PAGE, invoice.invoce._id))}
          onPay={() => navigate(navigateToPage(pages.PAYMENT_PAGE, invoice.invoce._id))}
          onCancel={handleCancel}
        /> 
      ))}
    </div>
  );
};


export default function HistoriesInvoice(props: any) {
  const { mainElement, invoiceHistory, role, onCancel } = props;
  const mainClass = classNames(styles.main, mainElement);

  return (
    <div className={mainClass}>
      <h2>{text[`PersonalPage.title.${role}.invoiceHistory` as keyof typeof text]}</h2>
      <ListInvoice invoiceHistory={invoiceHistory} role={role} onCancel={onCancel} />
    </div>
  );
}
