import { timeslotStatus } from "../../../common/constants";
import { formattedPrice } from "../../../common/functions";
import { getIcon, iconsName } from "../../../util/getAssets";
import css from "./ItemTimeslot.module.css";
import classNames from "classnames";

export default function ItemTimeslot(props: any) {
  const {
    item,
    tableItemClass,
    status = timeslotStatus.AVAILABLE,
    editIcon = getIcon({ nameIcon: iconsName.TRASH }),
    isEditMode = false,
  } = props;

  const { timeStart, timeEnd, price } = item;

  const mainClass = classNames(css.main, {
    [css.available]: status === timeslotStatus.AVAILABLE,
    [css.unavailable]: status === timeslotStatus.UNAVAILABLE,
    [css.booked]: status === timeslotStatus.BOOKED,
    [css.pending]: status === timeslotStatus.PENDING,
  }, tableItemClass);

  

  return (
    <div className={mainClass}>
      <p className={css.time}>
        {timeStart} - {timeEnd}
      </p>
      <p className={css.price}>{formattedPrice(price)}</p>
      {isEditMode && (
        <figure className={css.editIcon}>
          <img src={editIcon} alt="Edit" />
        </figure>
      )}
    </div>
  );
}
