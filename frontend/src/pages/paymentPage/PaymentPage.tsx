import { useEffect, useState } from "react";
import css from "./PaymentPage.module.css";
import { getInitialData } from "./PaymentPage.duck";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useAppSelector } from "../../redux/builder";
import Title from "../../components/titles/Title";
import { getIcon, iconsName } from "../../util/getAssets";
import text from "../../util/text";
import TableInvoice from "../../components/tableInvoice/TableInvoice";
import { formattedPrice } from "../../common/functions";
import ButtonIcon from "../../components/buttons/ButtonIcon";
import { useNavigate } from "react-router-dom";
import { PayOSConfig, usePayOS } from "@payos/payos-checkout";
import { doPayment } from "../../services/payment";

export default function PaymentPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    _id: userId,
    first_name,
    last_name,
  } = useAppSelector((state: any) => state.user.user);
  const { isPaymentProcessing, timeslot, totalPrice } = useAppSelector(
    (state: any) => state.paymentPage
  );
  const { name, location } = useAppSelector(
    (state: any) => state.paymentPage.court
  );

  const { _id: invoiceId, orderCode, amount, paymentStatus } = useAppSelector(
    (state: any) => state.paymentPage.invoice
  );

  const [payOSConfig, setPayOSConfig] = useState<PayOSConfig>({
    RETURN_URL: window.location.origin,
    ELEMENT_ID: "embedded-payment-container",
    CHECKOUT_URL: "",
    embedded: true,
    onSuccess: (e: any) => {handleSuccess()},
    onExit: (e: any) => {handleTimeout()},
  });
  const { open, exit } = usePayOS(payOSConfig);

  useEffect(() => {
    if (userId) dispatch(getInitialData(userId, navigate));
  }, [userId]);

  useEffect(() => {
    console.log(payOSConfig);
    if (payOSConfig.CHECKOUT_URL !== ""){
        open();
        // setTimeLeft(300);
        // setPayMode(true);
        // message.info("Vị trí chỉ sẽ được giữ cho bạn trong 5 phút, vui lòng thanh toán trong khoảng thời gian này!");
    }
    // eslint-disable-next-line
}, [payOSConfig]);

  const handleGetPaymentLink = async () => {
    const response = await doPayment(userId, invoiceId, amount, `${last_name} ${first_name}`);
    setPayOSConfig((oldConfig) => ({
        ...oldConfig,
        CHECKOUT_URL: response.checkoutUrl,
    }));
  };

  const handleSuccess = () => {
    console.log("success");
  }

  const handleTimeout = () => {
    console.log("timeout");
  }

  return (
    <main className={css.main}>
      <div className={css.inner}>
        <div className={css.left}>
          <Title
            mainElement={css.leftTitle}
            iconElement={css.leftIcon}
            icon={getIcon({ nameIcon: iconsName.RECEIPT })}
            title={text["PaymentPage.leftTitle"]}
          />
          <div className={css.userInfor}>
            <figure>
              <img src={getIcon({ nameIcon: iconsName.USER })} alt="" />
            </figure>
            <h3>{text["PaymentPage.title.nameBooking"]}</h3>
            <p>
              {last_name} {first_name}
            </p>
          </div>
          <div className={css.courtInfor}>
            <div className={css.courtInforItem}>
              <figure>
                <img
                  src={getIcon({ nameIcon: iconsName.DESCRIPTION })}
                  alt=""
                />
              </figure>
              <div>
                <h3>{text["PaymentPage.title.nameCourt"]}</h3>
                <p>{name}</p>
              </div>
              <div>
                <h3>{text["PaymentPage.title.nameAddress"]}</h3>
                <p>{location}</p>
              </div>
            </div>
            <TableInvoice
              data={timeslot}
              mainElement={css.tableInvoice}
              isHideTotal={true}
            />
          </div>
          <div className={css.total}>
            <h3>{text["PaymentPage.title.totalPrice"]}</h3>
            <p>{formattedPrice(totalPrice)} VND</p>
          </div>
          <div className={css.btnSubmitBlock}>
            <ButtonIcon
              onClick={handleGetPaymentLink}
              mainElement={css.btnSubmit}
              icon={getIcon({ nameIcon: iconsName.SEND })}
              content={text["PaymentPage.button"]}
            />
          </div>
        </div>
        <div className={css.right}>
          <div className={css.paymentContainer} id="embedded-payment-container"></div>
          {/* <p className='back-btn' onClick={handleCloseLink}>Trở lại</p>
          <p className='clock'>{formatTime(timeLeft)}</p> */}
          {/* </div> */}
        </div>
      </div>
    </main>
  );
}
