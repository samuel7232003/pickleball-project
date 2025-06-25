import { InputNumber, message } from "antd";
import text from "../../../util/text";
import css from "./FormNewTime.module.css";
import classNames from "classnames";
import ButtonIcon from "../../../components/buttons/ButtonIcon";
import { getIcon, iconsName } from "../../../util/getAssets";
import { useEffect, useState } from "react";

const generateHourlyTimeSlots = () => {
  const slots = [];
  for (let i = 0; i < 24; i++) {
    const startHour = i.toString().padStart(2, "0");
    const endHour = (i + 1).toString().padStart(2, "0");
    slots.push({
      startTime: `${startHour}:00`,
      endTime: i === 23 ? `00:00` : `${endHour}:00`,
      price: 100000,
      selected: false,
      id: i,
    });
  }
  return slots;
};

export default function FormNewTime(props: any) {
  const { mainElement, title, onSubmit } = props;
  const mainClass = classNames(css.main, mainElement);
  const [timeslots, setTimeslots] = useState(generateHourlyTimeSlots());

  const handleSelect = (id: number) => {
    setTimeslots(
      timeslots.map((slot) =>
        slot.id === id ? { ...slot, selected: !slot.selected } : slot
      )
    );
  };

  const handleChangePrice = (id: number, value: number | null) => {
    if (value) {
      setTimeslots(
        timeslots.map((slot) =>
          slot.id === id ? { ...slot, price: value } : slot
        )
      );
    }
  };

  const handleSubmit = () => {
    const selectedTimeslots = timeslots.filter((slot) => slot.selected);
    if (selectedTimeslots.length > 0) {
      onSubmit(selectedTimeslots);
      setTimeslots(generateHourlyTimeSlots());
    } else {
      message.error(text["CreateCourt.inputTimeError"]);
    }
  };

  return (
    <div className={mainClass}>
      <h3>{title}</h3>
      <div className={css.timeslotList}>
        {timeslots.map((item) => (
          <div
            key={item.id}
            className={classNames(css.timeslotItem, {
              [css.selected]: item.selected,
            })}
            onClick={() => handleSelect(item.id)}
          >
            <span className={css.timeRange}>
              <span>{item.startTime}</span>
              <span>{item.endTime}</span>
            </span>
            <div className={css.price} onClick={(e) => e.stopPropagation()}>
              <InputNumber
                min={0}
                step={10000}
                onChange={(value) => handleChangePrice(item.id, value)}
                value={item.price}
                disabled={!item.selected}
              />
              <p>.VND</p>
            </div>
          </div>
        ))}
      </div>
      <ButtonIcon
        onClick={handleSubmit}
        mainElement={css.btnAddTime}
        icon={getIcon({ nameIcon: iconsName.ADD })}
      />
    </div>
  );
}
