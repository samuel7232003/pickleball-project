import css from "./TableTimeslot.module.css";
import classNames from "classnames";
import text from "../../util/text";
import { useEffect, useState } from "react";
import ItemTimeslot from "./itemTimeslot/ItemTimeslot";

export default function TableTimeslot(props: any) {
  const {
    tableElement,
    tableHeaderElement,
    tableListElement,
    tableItem,
    tableHeader = [
      text["CreateCourt.inputTimeColumn"],
      text["CreateCourt.inputPriceColumn"],
    ],
    data = [],
    isEditMode = false,
    onRemove,
  } = props;

  const tableClass = classNames(css.main, tableElement);
  const tableHeaderClass = classNames(css.header, tableHeaderElement, {
    [css.editMode]: isEditMode,
  });
  const tableListClass = classNames(css.list, tableListElement);
  const tableItemClass = classNames(css.item, tableItem);

  const [dataShow, setDataShow] = useState(data);

  useEffect(() => {
    const parseTime = (timeStr: string): number => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const sortedData = [...data].sort((a: any, b: any) => {
      return parseTime(a.startTime) - parseTime(b.startTime);
    });
    setDataShow(sortedData);
  }, [data]);

  const handleRemove = (item: any) => {
    onRemove(item);
  };

  const ListItem = dataShow.map((item: any) => {
    return (
      <ItemTimeslot
        key={item.startTime + item.endTime}
        item={item}
        tableItemClass={tableItemClass}
        isEditMode={isEditMode}
        onRemove={handleRemove}
      />
    );
  });

  return (
    <div className={tableClass}>
      <div className={tableHeaderClass}>
        <p>{tableHeader[0]}</p>
        <p>{tableHeader[1]}</p>
      </div>
      <div className={tableListClass}>{ListItem}</div>
    </div>
  );
}
