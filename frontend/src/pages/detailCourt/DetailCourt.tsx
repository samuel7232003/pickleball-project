import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourt, setDateChoiced, setNumberChoiced, setTimeChoiced, setTimeChoicedRe } from "./DetailCourt.duck";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../redux/builder";
import css from "./DetailCourt.module.css";
import UploadImages from "../../components/upload/UploadImages";
import { getIcon, iconsName } from "../../util/getAssets";
import Title from "../../components/titles/Title";
import text from "../../util/text";
import { DatePicker } from "antd";
import TableTimeslot from "../../components/tableTimeslot/TableTimeslot";
import classNames from "classnames";
import NoteTimeslotChoice from "./noteTimeslotChoice/NoteTimeslotChoice";
import TableInvoice from "../../components/tableInvoice/TableInvoice";
import ButtonIcon from "../../components/buttons/ButtonIcon";
import dayjs from "dayjs";

const ListCourtNumber = (props: any) => {
  const { number, css, onChoose, numberChoie } = props;

  const handleChoose = (number: number) => {
    onChoose(number);
  };

  return (
    <ul className={css.courtNumber}>
      {Array.from({ length: number }, (_, index) => (
        <li
          key={index}
          onClick={() => handleChoose(index + 1)}
          className={numberChoie === index + 1 ? css.active : ""}
        >
          {text[`DetailCourt.courtNumber`].replace(
            "{number}",
            (index + 1).toString()
          )}
        </li>
      ))}
    </ul>
  );
};

export default function DetailCourt() {
  const { id } = useParams();
  const {
    name,
    number,
    location,
    images,
    timeslot,
    description,
    numberChoie,
    timeChoie,
    totalPrice,
    dateChoiced,
    isLoading,
    canSubmit,
  } = useAppSelector((state: any) => state.detailCourt);
  const dispatch = useDispatch();

  const [allowChoiceTimeslot, setAllowChoiceTimeslot] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getCourt(id as string) as any);
    }
  }, [id]);

  useEffect(() => {
    if (dateChoiced && numberChoie) {
      setAllowChoiceTimeslot(true);
    } else {
      setAllowChoiceTimeslot(false);
    }
  }, [dateChoiced, numberChoie]);

  const onChooseNumber = (number: number) => {
    dispatch(setNumberChoiced(number));
  };

  const handleChooseDate = (date: any) => {
    dispatch(setDateChoiced(date.format("DD-MM-YYYY")));
  };

  const handleChooseTimeslot = (item: any) => {
    dispatch(setTimeChoiced(item) as any);
  };

  const handleReChoice = (item: any) => {
    dispatch(setTimeChoicedRe(item) as any);
  };

  const onSubmit = () => {
    console.log("submit");
  };

  return (
    <main className={css.main}>
      <div className={css.inner}>
        <div className={css.left}>
          <UploadImages listImage={images} isEdit={false} />
        </div>
        <div className={css.right}>
          <h2>{name}</h2>
          <div className={css.address}>
            <Title
              mainElement={css.title}
              iconElement={css.icon}
              icon={getIcon({ nameIcon: iconsName.MAP })}
              title={text["CreateCourt.inputAddressTitle"]}
            />
            <p className={css.contentText}>{location}</p>
          </div>
          <div className={css.description}>
            <Title
              mainElement={css.title}
              iconElement={css.icon}
              icon={getIcon({ nameIcon: iconsName.DESCRIPTION })}
              title={text["CreateCourt.inputDescriptionTitle"]}
            />
            <p className={css.contentText}>{description}</p>
          </div>
          <div className={css.timeslot}>
            <div className={css.timeslotLeft}>
              <div className={css.timeslotTitle}>
                <Title
                  mainElement={css.title}
                  iconElement={css.icon}
                  icon={getIcon({ nameIcon: iconsName.CALENDAR })}
                  title={text["CreateCourt.inputTimeslotTitle"]}
                />
                <DatePicker
                  placeholder={text["DetailCourt.inputDatePlaceholder"]}
                  value={dateChoiced ? dayjs(dateChoiced, "DD-MM-YYYY") : null}
                  onChange={handleChooseDate}
                  minDate={dayjs()}
                  allowClear={false}
                />
              </div>
              <ListCourtNumber
                number={number}
                css={css}
                onChoose={onChooseNumber}
                numberChoie={numberChoie}
              />
              <TableTimeslot
                tableElement={css.tableTimeslot}
                data={timeslot}
                isEditMode={false}
                isChoiceMode={true}
                isEmpty={!allowChoiceTimeslot}
                onChoose={handleChooseTimeslot}
                timeChoie={timeChoie}
                onReChoice={handleReChoice}
                dateChoiced={dateChoiced}
                numberChoie={numberChoie}
              />
              <NoteTimeslotChoice mainElement={css.noteTimeslotChoice} />
            </div>
            <div className={css.timeslotRight}>
              <Title
                mainElement={classNames(css.title, css.titleYourChoice)}
                iconElement={css.icon}
                icon={getIcon({ nameIcon: iconsName.CHECK_SQUARE })}
                title={text["DetialCourt.yourChoiceTitle"]}
              />
              <TableInvoice 
                mainElement={css.tableInvoice} 
                data={timeChoie}
                totalPrice={totalPrice}
              />
              <div className={css.btnSubmitBlock}>
                <ButtonIcon
                  onClick={onSubmit}
                  mainElement={css.btnSubmit}
                  icon={getIcon({ nameIcon: iconsName.SEND })}
                  content={text["DetailCourt.buttonSubmit"]}
                  isDisabled={!canSubmit}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
