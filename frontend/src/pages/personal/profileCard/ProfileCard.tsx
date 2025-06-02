import UploadImageAvatar from "../../../components/upload/UploadImageAvatar";
import classNames from "classnames";
import styles from "./ProfileCard.module.css";
import text from "../../../util/text";
import Title from "../../../components/titles/Title";
import { getIcon, iconsName } from "../../../util/getAssets";
import { useState } from "react";
import ModalBoxInput from "../../../components/modal/ModalBoxInputName";
import { Input } from "antd";

export default function ProfileCard(props:any) {
  const { mainElement, isEdit, onChange, userProfile, onEditName } = props;
  const {avatar, first_name, last_name, username, role } = userProfile;

  const mainClass = classNames(styles.main, mainElement);
  const [isEditName, setIsEditName] = useState(false);

  const handleEditName = (data: any) => {
    if(data) {
      onEditName(data);
    } 
    setIsEditName(false);
  };

  return (
    <div className={mainClass}>
      <ModalBoxInput
        firstName={first_name}
        lastName={last_name}
        open={isEditName}
        onClose={handleEditName}
        title={text["PersonalPage.modal.editName"]}
        placeholderFirstName={text["PersonalPage.modal.editFirstNamePlaceholder"]}
        placeholderLastName={text["PersonalPage.modal.editLastNamePlaceholder"]}
        textError={text["PersonalPage.modal.errorEmpty"]}
      />
      <div className={styles.avatarContainer}>
        <UploadImageAvatar
          mainElement={styles.avatarSection}
          image={avatar}
          isEdit={isEdit}
          onChange={onChange}
        />
        <div className={styles.name}>
          <h2>{first_name} {last_name}</h2>
          <p>{text[`PersonalPage.role.${role}` as keyof typeof text]}</p>
          {isEdit && (
            <figure className={styles.iconEdit} onClick={() => setIsEditName(true)}>
              <img src={getIcon({nameIcon: iconsName.EDIT})} alt="edit" />
            </figure>
          )}
        </div>
      </div>
      <div className={styles.profileInfo}>
        <div className={styles.accountInfo}>
          <Title
            mainElement={styles.title}
            title={text["PersonalPage.title.accountInfo"]}
            icon={getIcon({nameIcon: iconsName.ACCOUNT_INFO})}
          />
          <div className={styles.infoField}>
            <label>{text["PersonalPage.title.username"]}</label>
            <span>{username}</span>
          </div>
          <div className={styles.infoField}>
            <label>{text["PersonalPage.title.password"]}</label>
            <span>{text["PersonalPage.password"]}</span>
          </div>
        </div>
        {isEdit && (
          <figure className={styles.iconEdit}>
            <img src={getIcon({nameIcon: iconsName.EDIT})} alt="edit" />
          </figure>
        )}
      </div>
    </div>
  );
}