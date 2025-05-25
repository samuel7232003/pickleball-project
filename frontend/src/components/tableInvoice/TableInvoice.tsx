import text from "../../util/text";
import classNames from "classnames";
import css from "./TableInvoice.module.css";
import { useEffect, useState } from "react";
import { formattedPrice } from "../../common/functions";

const Item = (props: any) => {
  const { item, showDate, tableItemClass } = props;
  const { startTime, endTime, price, dateChoiced, numberChoie } = item;
  return (
    <div key={`${startTime}-${endTime}-${dateChoiced}-${numberChoie}`}>
      {showDate && <p className={css.date}>{dateChoiced}</p>}
      <div className={tableItemClass}>
        <p>
          {startTime} - {endTime}
        </p>
        <p>{numberChoie}</p>
        <p>{formattedPrice(price)}</p>
      </div>
    </div>
  );
};

const ListItem = (props: any) => {
  const {
    startTime,
    endTime,
    tableListClass,
    dataShow,
    tableItemClass,
  } = props;
  let lastDate = "";
  return (
    <div className={tableListClass}>
      {dataShow.map((item: any) => {
        const { dateChoiced, numberChoie } = item;
        const showDate = dateChoiced !== lastDate;
        lastDate = dateChoiced;

        return (
          <Item
            key={`${startTime}-${endTime}-${dateChoiced}-${numberChoie}`}
            item={item}
            showDate={showDate}
            tableItemClass={tableItemClass}
          />
        );
      })}
    </div>
  );
};

export default function TableInvoice(props: any) {
  const {
    mainElement,
    tableHeaderElement,
    tableListElement,
    tableItemElement,
    totalElement,
    data = [],
    totalPrice = 0,
    isHideTotal = false,
  } = props;

  const mainClass = classNames(css.main, mainElement);
  const tableHeaderClass = classNames(css.header, tableHeaderElement);
  const tableListClass = classNames(css.list, tableListElement);
  const tableItemClass = classNames(css.item, tableItemElement);
  const totalClass = classNames(css.total, totalElement);

  const [dataShow, setDataShow] = useState(data);

  useEffect(() => {
    const parseTime = (timeStr: string): number => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const parseDate = (dateStr: string): number => {
      const [day, month, year] = dateStr.split("-").map(Number);
      return new Date(year, month - 1, day).getTime();
    };

    const sortedData = [...data].sort((a: any, b: any) => {
      const dateA = parseDate(a.dateChoiced);
      const dateB = parseDate(b.dateChoiced);

      if (dateA !== dateB) {
        return dateA - dateB;
      }

      return parseTime(a.startTime) - parseTime(b.startTime);
    });

    setDataShow(sortedData);
  }, [data]);

  return (
    <div className={mainClass}>
      <div className={tableHeaderClass}>
        <p>{text["TableInvoice.header1"]}</p>
        <p>{text["TableInvoice.header2"]}</p>
        <p>{text["TableInvoice.header3"]}</p>
      </div>
      {dataShow.length > 0 ? (
        <ListItem
          tableListClass={tableListClass}
          dataShow={dataShow}
          tableItemClass={tableItemClass}
        />
      ) : (
        <p className={css.empty}>{text["DetailCourt.emptyInvoice"]}</p>
      )}
      {!isHideTotal && <div className={totalClass}>
        <p>{text["TableInvoice.total"]}</p>
        <p>{formattedPrice(totalPrice)}</p>
      </div>}
    </div>
  );
}
