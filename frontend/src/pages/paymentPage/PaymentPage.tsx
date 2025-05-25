import { useEffect } from "react";
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

export default function PaymentPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {_id: userId, first_name, last_name} = useAppSelector((state: any) => state.user.user);
  const {isPaymentProcessing, timeslot, totalPrice} = useAppSelector((state: any) => state.paymentPage);
  const {name, location} = useAppSelector((state: any) => state.paymentPage.court);

  useEffect(()=>{
    if(userId) dispatch(getInitialData(userId));
  },[userId])

  return (
    <main className={css.main}>
      <div className={css.inner}>
        <div className={css.left}>
          <Title
            mainElement={css.leftTitle}
            iconElement={css.leftIcon}
            icon={getIcon({ nameIcon: iconsName.RECEIPT })}
            title= {text["PaymentPage.leftTitle"]}
          />
          <div className={css.userInfor}>
            <figure><img src={getIcon({nameIcon: iconsName.USER})} alt="" /></figure>
            <h3>{text["PaymentPage.title.nameBooking"]}</h3>
            <p>{last_name} {first_name}</p>
          </div>
          <div className={css.courtInfor}>
            <div className={css.courtInforItem}>
              <figure><img src={getIcon({nameIcon: iconsName.DESCRIPTION})} alt="" /></figure>
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
              onClick={()=>{}}
              mainElement={css.btnSubmit}
              icon={getIcon({ nameIcon: iconsName.SEND })}
              content={text["CreateCourt.button"]}
            />
          </div>
        </div>
        {isPaymentProcessing && <div className={css.right}>
        </div>}
      </div>
    </main>
  );
}