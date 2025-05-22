import css from "./CreateCourt.module.css";
import UploadImages from "../../components/upload/UploadImages";
import FieldInputText from "../../components/fields/FieldInputText";
import text from "../../util/text";
import Title from "../../components/titles/Title";
import { getIcon, iconsName } from "../../util/getAssets";
import { InputNumber } from "antd";
import TableTimeslot from "../../components/tableTimeslot/TableTimeslot";
import { useDispatch, useSelector } from "react-redux";
import {
  ON_CHANGE_DESCRIPTION,
  ON_CHANGE_LOCATION,
  ON_CHANGE_NAME,
  ON_CHANGE_NUMBER,
  onChangeField,
} from "./CreateCourt.duck";
import FormNewTime from "./formNewTime/FormNewTime";
import ButtonIcon from "../../components/buttons/ButtonIcon";

export default function CreateCourt() {
  const { listTimeslot, name, location, description, number } = useSelector(
    (state: any) => state.createCourt
  );
  const dispatch = useDispatch();

  const onChangeFieldText = (type: string) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      dispatch(onChangeField(type, value));
    };
  };

  const handleChangeNumber = (type: string) => {
    return (value: number | null) => {
      if (value) dispatch(onChangeField(type, value));
    };
  };

  return (
    <main className={css.main}>
      <div className={css.inner}>
        <div className={css.left}>
          <UploadImages />
        </div>
        <div className={css.right}>
          <FieldInputText
            blockElement={css.name}
            inputElement={css.inputName}
            inputPlaceholder={text["CreateCourt.inputNamePlaceholder"]}
            onChange={onChangeFieldText(ON_CHANGE_NAME)}
            isIconInfo={true}
            value={name}
          />
          <div className={css.address}>
            <Title
              mainElement={css.title}
              iconElement={css.icon}
              icon={getIcon({ nameIcon: iconsName.MAP })}
              title={text["CreateCourt.inputAddressTitle"]}
            />
            <FieldInputText
              blockElement={css.inputAddress}
              inputElement={css.inputAddress}
              inputPlaceholder={text["CreateCourt.inputAddressPlaceholder"]}
              onChange={onChangeFieldText(ON_CHANGE_LOCATION)}
              isIconInfo={true}
              value={location}
            />
          </div>
          <div className={css.description}>
            <Title
              mainElement={css.title}
              iconElement={css.icon}
              icon={getIcon({ nameIcon: iconsName.DESCRIPTION })}
              title={text["CreateCourt.inputDescriptionTitle"]}
            />
            <FieldInputText
              blockElement={css.inputDescription}
              inputElement={css.inputDescription}
              inputPlaceholder={text["CreateCourt.inputDescriptionPlaceholder"]}
              onChange={onChangeFieldText(ON_CHANGE_DESCRIPTION)}
              isIconInfo={true}
              isOneLine={false}
              value={description}
            />
          </div>
          <div className={css.timeslot}>
            <div className={css.timeslotTitle}>
              <Title
                mainElement={css.titleSub}
                iconElement={css.icon}
                icon={getIcon({ nameIcon: iconsName.CALENDAR })}
                title={text["CreateCourt.inputTimeslotTitle"]}
                isIconInfo={true}
              />
              <div className={css.number}>
                <Title
                  mainElement={css.titleSub}
                  iconElement={css.icon}
                  icon={getIcon({ nameIcon: iconsName.NUMBER })}
                  title={text["CreateCourt.inputNumberTitle"]}
                  isIconInfo={true}
                />
                <InputNumber
                  min={1}
                  value={number}
                  size="large"
                  onChange={handleChangeNumber(ON_CHANGE_NUMBER)}
                />
              </div>
            </div>
            <div className={css.timeslotContent}>
              <TableTimeslot data={listTimeslot} isEditMode={true} />
              <FormNewTime
                title={text["CreateCourt.inputTimeslotTitle"]}
              />
            </div>
          </div>
          <div className={css.btnSubmitBlock}>
            <ButtonIcon
              onClick = {() => {}}
              mainElement = {css.btnSubmit}
              icon = {getIcon({nameIcon: iconsName.SEND})}
              content = {text["CreateCourt.button"]}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
