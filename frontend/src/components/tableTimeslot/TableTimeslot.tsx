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
      return parseTime(a.timeStart) - parseTime(b.timeStart);
    });

    if (data.length > 0) {
      setDataShow(sortedData);
    }
  }, [data]);

  const ListItem = dataShow.map((item: any, index: number) => {
    return (
      <ItemTimeslot
        key={index}
        item={item}
        tableItemClass={tableItemClass}
        isEditMode={isEditMode}
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
