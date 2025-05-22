import { InputNumber, TimePicker } from "antd";
import text from "../../../util/text";
import css from "./FormNewTime.module.css";
import classNames from "classnames";
import ButtonIcon from "../../../components/buttons/ButtonIcon";
import { getIcon, iconsName } from "../../../util/getAssets";
import { initialTimeslot } from "../../../common/constants";
import { useState } from "react";
import dayjs from "dayjs";
import { data } from "react-router-dom";

export default function FormNewTime(props: any) {
  const {
    mainElement,
    title,
    titleSubs = [
      text["CreateCourt.inputTimeColumn"],
      text["CreateCourt.inputPriceColumn"],
    ],
    onSubmit,
  } = props;

  const mainClass = classNames(css.main, mainElement);

  const [item, setItem] = useState(initialTimeslot);

  const handleChangeNumber = (value:number|null) => {
    if(value) setItem({...item, price: value});
  };

  const handleChangeTime = (dates:any) =>{
    if (dates && dates.length === 2) {
      const [start, end] = dates;
      setItem({
        ...item, 
        startTime: start.format("HH:mm"),
        endTime: end.format("HH:mm"),
      });
    }
  }

  const handleSubmit = () => {
    return () => onSubmit(item);
  };

  return (
    <div className={mainClass}>
      <h3>{title}</h3>
      <div className={css.part}>
        <p>{titleSubs[0]}</p>
        <TimePicker.RangePicker
          allowClear={false}
          format="HH:mm"
          value={[dayjs(item.startTime, "HH:mm"), dayjs(item.endTime, "HH:mm")]}
          onChange={handleChangeTime}
        />
      </div>
      <div className={css.part}>
        <p>{titleSubs[1]}</p>
        <div className={css.price}>
          <InputNumber min={0} step={10000} onChange={handleChangeNumber} value={item.price}/>
          <p>.VND</p>
        </div>
      </div>
      <ButtonIcon
        onClick={handleSubmit}
        mainElement={css.btnAddTime}
        icon={getIcon({ nameIcon: iconsName.ADD })}
      />
    </div>
  );
}
