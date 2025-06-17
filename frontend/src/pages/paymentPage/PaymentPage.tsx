import { useEffect, useState} from "react";
import css from "./PaymentPage.module.css";
import {
  getInitialData,
  handlePaymentSuccess,
  handlePaymentTimeout,
  paymentProcessing,
  updateInvoiceStatusToWaiting,
} from "./PaymentPage.duck";
import { useAppDispatch, useAppSelector } from "../../redux/builder";
import { RootState } from "../../redux/store";
import Title from "../../components/titles/Title";
import { getIcon, iconsName } from "../../util/getAssets";
import text from "../../util/text";
import TableInvoice from "../../components/tableInvoice/TableInvoice";
import ButtonIcon from "../../components/buttons/ButtonIcon";
import { useNavigate, useParams } from "react-router-dom";
import { PayOSConfig, usePayOS } from "@payos/payos-checkout";
import { doPayment } from "../../services/payment";
import { message } from "antd";
import { PaymentPageState } from "./PaymentPage.duck";
import Countdown from "../../components/countdown/Countdown";

const PAYMENT_SUCCESS_MESSAGE = text["PaymentPage.message.success"] as string;
const PAYMENT_TIMEOUT_MESSAGE = text["PaymentPage.message.timeout"] as string;
const PAYMENT_EXPIRATION_TIME = 5 * 60 * 1000;

export default function PaymentPage() {
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const [expirationTimer, setExpirationTimer] = useState<NodeJS.Timeout | null>(null);
  const { invoiceId } = useParams<{ invoiceId: string }>();
  
  const {
    _id: userId,
    first_name,
    last_name,
  } = useAppSelector((state: RootState) => state.user.user);
  
  const {
    isPaymentProcessing,
    timeslot,
    totalPrice,
    errorMessage,
    court,
    invoice,
    isPaymentSuccess,
    isViewMode,
  } = useAppSelector((state: RootState) => state.paymentPage as PaymentPageState);

  const [payOSConfig, setPayOSConfig] = useState<PayOSConfig>({
    RETURN_URL: window.location.origin,
    ELEMENT_ID: "embedded-payment-container",
    CHECKOUT_URL: "",
    embedded: true,
    onSuccess: () => handleSuccess(),
    onExit: () => handleTimeout(),
    onCancel: () => handleTimeout(),
  });
  
  const { open, exit } = usePayOS(payOSConfig);

  useEffect(() => {
    if (userId) {
      dispatch(getInitialData(userId, navigate, invoiceId || ""));
    }
  }, [userId, dispatch, navigate]);

  useEffect(() => {
    if (payOSConfig.CHECKOUT_URL && !isInitialized) {
      setIsInitialized(true);
      dispatch(updateInvoiceStatusToWaiting());
      dispatch(paymentProcessing({ isPaymentProcessing: true }));
      open();
      messageApi.info(text["PaymentPage.message.start"] as string);
  
      const timer = setTimeout(() => {
        handleTimeout();
      }, PAYMENT_EXPIRATION_TIME);
  
      setExpirationTimer(timer);
    }
  }, [payOSConfig.CHECKOUT_URL]);
  

  useEffect(() => {
    if (errorMessage) {
      messageApi.error(errorMessage);
    }
  }, [errorMessage, messageApi]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (expirationTimer) {
        clearTimeout(expirationTimer);
      }
    };
  }, [expirationTimer]);

  const handleGetPaymentLink = (async () => {
    try {
      if (!userId || !invoice._id || !invoice.amount) {
        messageApi.error(text["PaymentPage.message.error"]);
        return;
      }
      dispatch(paymentProcessing({ isPaymentProcessing: true }));

      const response = await doPayment(
        userId,
        invoice._id,
        invoice.amount,
        `${last_name} ${first_name}`
      );

      console.log(response);
      
      if (!response?.checkoutUrl) {
        throw new Error("Failed to get payment URL");
      }

      setIsInitialized(false);
      setPayOSConfig((oldConfig) => ({
        ...oldConfig,
        CHECKOUT_URL: response.checkoutUrl,
      }));
    } catch (error) {
      messageApi.error(
        error instanceof Error ? error.message : "Failed to get payment link"
      );
    }
  });

  const handleSuccess =() => {
    if (expirationTimer) {
      clearTimeout(expirationTimer);
    }
    dispatch(handlePaymentSuccess());
    messageApi.success(PAYMENT_SUCCESS_MESSAGE);
    setIsInitialized(false);
    exit();
  };

  const handleTimeout =() => {
    if (expirationTimer) {
      clearTimeout(expirationTimer);
    }
    dispatch(handlePaymentTimeout());
    messageApi.warning(PAYMENT_TIMEOUT_MESSAGE);
    setIsInitialized(false);
    exit();
  };

  return (
    <main className={css.main}>
      {contextHolder}
      <div className={css.inner}>
        <div className={css.left}>
          <Title
            mainElement={css.leftTitle}
            iconElement={css.leftIcon}
            icon={getIcon({ nameIcon: iconsName.RECEIPT })}
            title={text["PaymentPage.leftTitle"] as string}
          />
          <div className={css.userInfor}>
            <figure>
              <img src={getIcon({ nameIcon: iconsName.USER })} alt="user" />
            </figure>
            <h3>{text["PaymentPage.title.nameBooking"] as string}</h3>
            <p>
              {last_name} {first_name}
            </p>
          </div>
          <div className={css.courtInfor}>
            <div className={css.courtInforItem}>
              <figure>
                <img
                  src={getIcon({ nameIcon: iconsName.DESCRIPTION })}
                  alt="court"
                />
              </figure>
              <div>
                <h3>{text["PaymentPage.title.nameCourt"] as string}</h3>
                <p>{court.name}</p>
              </div>
              <div>
                <h3>{text["PaymentPage.title.nameAddress"] as string}</h3>
                <p>{court.location}</p>
              </div>
            </div>
            <TableInvoice
              data={timeslot}
              mainElement={css.tableInvoice}
              totalPrice={totalPrice}
            />
          </div>
          {!isPaymentSuccess && !isViewMode && <div className={css.btnSubmitBlock}>
            <ButtonIcon
              onClick={handleGetPaymentLink}
              mainElement={css.btnSubmit}
              icon={getIcon({ nameIcon: iconsName.SEND })}
              content={text["PaymentPage.button"] as string}
              isDisabled={isPaymentProcessing}
            />
          </div>}
        </div>
        <div className={isInitialized ? css.right : css.rightHidden}>
          {isInitialized && (
            <Countdown
              initialTime={5}
              onExpire={handleTimeout}
            />
          )}
          <div className={css.paymentContainer} id="embedded-payment-container" />
        </div>
      </div>
    </main>
  );
}

