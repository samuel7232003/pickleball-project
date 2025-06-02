import css from "./CreateCourt.module.css";
import UploadImages from "../../components/upload/UploadImages";
import FieldInputText from "../../components/fields/FieldInputText";
import text from "../../util/text";
import Title from "../../components/titles/Title";
import { getIcon, iconsName } from "../../util/getAssets";
import { InputNumber, message } from "antd";
import TableTimeslot from "../../components/tableTimeslot/TableTimeslot";
import { useDispatch, useSelector } from "react-redux";
import {
  getCourt,
  handleSubmit,
  ON_CHANGE_DESCRIPTION,
  ON_CHANGE_DISABLED,
  ON_CHANGE_LOCATION,
  ON_CHANGE_NAME,
  ON_CHANGE_NUMBER,
  onChangeField,
  onChangeImages,
  onChangeListTimeslot,
} from "./CreateCourt.duck";
import FormNewTime from "./formNewTime/FormNewTime";
import ButtonIcon from "../../components/buttons/ButtonIcon";
import type { UploadFile } from "antd/es/upload/interface";
import { timeToMinutes } from "../../common/functions";
import { useAppSelector } from "../../redux/builder";
import { AppDispatch } from "../../redux/store";
import { useEffect } from "react";
import navigateToPage from "../../config/navigate";
import { pages } from "../../router";
import { useNavigate, useParams } from "react-router-dom";
import { roles } from "../../common/constants";
import defaultStyles from '../../styles/default-styles.module.css';

export default function CreateCourt() {
  const { id } = useParams();
  const { _id: ownerId, role } = useAppSelector((state: any) => state.user.user);
  const {
    listTimeslot,
    name,
    location,
    description,
    number,
    images,
    errorMessage,
    successMessage,
    isSubmitting,
    isDisabled,
    isSuccess,
  } = useSelector((state: any) => state.createCourt);
  const dispatch = useDispatch<AppDispatch>();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  useEffect(() => {
    if(role === roles.USER) {
      navigate(navigateToPage(pages.SEARCH_PAGE));
    }
  }, [role]);

  useEffect(() => {
    if(id) {
      dispatch(getCourt(id) as any);
    }
  }, [id]);

  useEffect(() =>{
    if(isSuccess){
      navigate(navigateToPage(pages.SEARCH_PAGE));
    }
  },[isSuccess]);

  useEffect(() => {
    if (
      !listTimeslot ||
      !name ||
      !location ||
      !description ||
      !number ||
      images.length === 0
    ) {
      dispatch(onChangeField(ON_CHANGE_DISABLED, true));
    } else {
      dispatch(onChangeField(ON_CHANGE_DISABLED, false));
    }
  }, [listTimeslot, name, location, description, number, images]);

  useEffect(() => {
    if (errorMessage) {
      messageApi.error(errorMessage);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      messageApi.success(successMessage);
    }
  }, [successMessage]);

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

  const handleImagesChange = (fileList: UploadFile[]) => {
    dispatch(onChangeImages(fileList));
  };

  const handleAddTimeslot = (item: any) => {
    const newStart = timeToMinutes(item.startTime);
    const newEnd = timeToMinutes(item.endTime);

    if (newStart >= newEnd) {
      messageApi.error(text["CreateCourt.timeError"]);
      return;
    }

    const isOverlapping = listTimeslot.some((slot: any) => {
      const existingStart = timeToMinutes(slot.startTime);
      const existingEnd = timeToMinutes(slot.endTime);

      return newStart < existingEnd && newEnd > existingStart;
    });

    if (isOverlapping) {
      messageApi.error(text["CreateCourt.isOverlapping"]);
      return;
    }

    dispatch(onChangeListTimeslot([...listTimeslot, item]));
  };

  const handleRemoveTimeslot = (item: any) => {
    dispatch(
      onChangeListTimeslot(
        listTimeslot.filter(
          (slot: any) =>
            slot.startTime !== item.startTime && slot.endTime !== item.endTime
        )
      )
    );
  };

  const handleChangeAddress = (value: any) => {
    const { lng, lat, address } = value;
    dispatch(onChangeField(ON_CHANGE_LOCATION, { lng, lat, address }));
  };

  const onSubmit = () => {
    if (ownerId) {
      dispatch(handleSubmit(ownerId, id) as any);
    }
  };

  return (
    <main className={css.main}>
      {contextHolder}
      <div className={css.inner}>
        <div className={css.left}>
          <UploadImages onChange={handleImagesChange} listImage={images} />
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
              onChange={handleChangeAddress}
              isIconInfo={true}
              value={location}
              isAddress={true}
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
              <TableTimeslot
                data={listTimeslot}
                isEditMode={true}
                onRemove={handleRemoveTimeslot}
              />
              <FormNewTime
                title={text["CreateCourt.inputTimeslotTitle"]}
                onSubmit={handleAddTimeslot}
              />
            </div>
          </div>
          <div className={css.btnSubmitBlock}>
            <ButtonIcon
              mainElement={`${css.btnSubmit} ${defaultStyles.submitButtonHover}`}
              iconElement={css.icon}
              icon={getIcon({ nameIcon: iconsName.SEND })}
              content={id ? text["CreateCourt.buttonEdit"] : text["CreateCourt.buttonCreate"]}
              onClick={onSubmit}
              isDisabled={isDisabled}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
