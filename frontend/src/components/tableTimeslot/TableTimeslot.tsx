import css from "./TableTimeslot.module.css";
import classNames from "classnames";
import text from "../../util/text";
import { useMemo } from "react";
import ItemTimeslot from "./itemTimeslot/ItemTimeslot";
import { timeslotStatus } from "../../common/constants";

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
    isChoiceMode = false,
    timeChoie = [],
    onRemove,
    onChoose,
    onReChoice,
    isEmpty = false,
    dateChoiced = "",
    numberChoie = 0,
  } = props;

  const tableClass = classNames(css.main, tableElement);
  const tableHeaderClass = classNames(css.header, tableHeaderElement, {
    [css.editMode]: isEditMode,
  });
  const tableListClass = classNames(css.list, tableListElement);
  const tableItemClass = classNames(css.item, tableItem);

  const sortedData = (data: any) => {
    const parseTime = (timeStr: string): number => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    return [...data].sort((a: any, b: any) => {
      return parseTime(a.startTime) - parseTime(b.startTime);
    });
  };

  const handleChoose = (item: any) => {
    onChoose(item);
  };

  const handleRemove = (item: any) => {
    onRemove(item);
  };

  const handleReChoice = (item: any) => {
    onReChoice(item);
  };

  const getStatus = (item: any) => {
    if (item.status === "UNAVAILABLE") {
      return timeslotStatus.UNAVAILABLE;
    } else if (item.status === "PENDING") {
      return timeslotStatus.PENDING;
    }
    if (
      timeChoie.some((time: any) => {
        const { startTime, endTime, dateChoiced: dateChoiced_, numberChoie: numberChoie_ } = time;
        return (
          startTime === item.startTime &&
          endTime === item.endTime &&
          dateChoiced_ === dateChoiced &&
          numberChoie_ === numberChoie
        );
      })
    ) {
      return timeslotStatus.BOOKED;
    }
    return timeslotStatus.AVAILABLE;
  };

  const ListItem = sortedData(data).map((item: any) => {
    const { startTime, endTime } = item;
    return (
      <ItemTimeslot
        key={startTime + endTime}
        item={item}
        tableItemClass={tableItemClass}
        isEditMode={isEditMode}
        isChoiceMode={isChoiceMode}
        onRemove={handleRemove}
        onChoose={handleChoose}
        status={getStatus(item)}
        onReChoice={handleReChoice}
      />
    );
  });

  return (
    <div className={tableClass}>
      <div className={tableHeaderClass}>
        <p>{tableHeader[0]}</p>
        <p>{tableHeader[1]}</p>
      </div>
      {!isEmpty ? (
        <div className={tableListClass}>{ListItem}</div>
      ) : (
        <p className={css.empty}>{text["DetailCourt.emptyTimeslot"]}</p>
      )}
    </div>
  );
}
