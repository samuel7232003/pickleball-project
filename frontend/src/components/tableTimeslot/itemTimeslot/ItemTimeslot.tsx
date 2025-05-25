import { message } from "antd";
import { timeslotStatus } from "../../../common/constants";
import { formattedPrice } from "../../../common/functions";
import { getIcon, iconsName } from "../../../util/getAssets";
import css from "./ItemTimeslot.module.css";
import classNames from "classnames";
import text from "../../../util/text";

export default function ItemTimeslot(props: any) {
  const {
    item,
    tableItemClass,
    status = timeslotStatus.AVAILABLE,
    editIcon = getIcon({ nameIcon: iconsName.TRASH }),
    isEditMode = false,
    isChoiceMode = false,
    onRemove,
    onChoose,
    onReChoice,
  } = props;

  const { startTime, endTime, price, dateChoiced, numberChoie } = item;

  const [messageApi, contextHolder] = message.useMessage();


  const mainClass = (status: any) => classNames(css.main, {
    [css.available]: status === timeslotStatus.AVAILABLE,
    [css.unavailable]: status === timeslotStatus.UNAVAILABLE,
    [css.booked]: status === timeslotStatus.BOOKED,
    [css.pending]: status === timeslotStatus.PENDING,
  }, tableItemClass);

  const handleRemove = () => {
    onRemove(item);
  };

  const handleChoose = () => {
    if(!isChoiceMode) {
      return;
    }
    if (status === timeslotStatus.AVAILABLE) {
      onChoose(item);
    }
    if (status === timeslotStatus.BOOKED) {
      onReChoice(item);
    }
    if (status === timeslotStatus.UNAVAILABLE) {
      messageApi.error(text["DetailCourt.unavailableTimeslot"]);
    }
    if (status === timeslotStatus.PENDING) {
      messageApi.error(text["DetailCourt.pendingTimeslot"]);
    }
  };

  return (
    <div className={mainClass(status)} onClick={handleChoose}>
      {contextHolder}
      <p className={css.time}>
        {startTime} - {endTime}
      </p>
      <p className={css.price}>{formattedPrice(price)}</p>
      {isEditMode && (
        <figure className={css.editIcon} onClick={handleRemove}>
          <img src={editIcon} alt="Edit" />
        </figure>
      )}
    </div>
  );
}
