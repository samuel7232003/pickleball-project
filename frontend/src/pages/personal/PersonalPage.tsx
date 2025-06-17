import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styles from "./PersonalPage.module.css";
import css from "../../components/mapbox/SearchBox.module.css";
import {
  cancelInvoice,
  initializePersonalPage,
  updateUserProfile,
  updateUserProfileAvatar,
} from "./PersonalPage.duck";
import { useAppSelector } from "../../redux/builder";
import { AppDispatch } from "../../redux/store";
import ProfileCard from "./profileCard/ProfileCard";
import HistoriesInvoice from "./historiesInvoice/HistoriesInvoice";
import { message } from "antd";
import { pages } from "../../router";
import CardCourtSearchItem from "../../components/card/CardCourtSearchItem";
import classNames from "classnames";
import navigateToPage from "../../config/navigate";

const ListCourtSearchItem = (props: any) => {
  const { results, handleCourtSelect } = props;
  const mainClass = classNames(css.listResult, styles.listResult);
  return (
    <div className={mainClass}>
      {results.map((item: any, idx: number) => (
        <CardCourtSearchItem  
          key={idx}
          court={item}
          onClick={handleCourtSelect}
        />
      ))}
    </div>
  );
};

export default function PersonalPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [messageApi, contextHolder] = message.useMessage();
  const { setCurPage }: any = useOutletContext();
  const navigate = useNavigate();

  const { _id: currentUserId } = useAppSelector(
    (state: any) => state.user.user
  );
  const { userProfile, invoiceHistory, isLoading, successMessage, listCourt } =
    useSelector((state: any) => state.personalPage);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    setCurPage(pages.PERSONAL_PAGE);
    if (id) {
      dispatch(initializePersonalPage(id, currentUserId));
    }
    if (id === currentUserId) {
      setIsEdit(true);
    }
  }, [id, currentUserId, dispatch]);

  useEffect(() => {
    if (successMessage) {
      messageApi.success(successMessage);
    }
  }, [successMessage]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userProfile) {
    return <div>User not found</div>;
  }

  const handleChangeAvatar = (avatar: any) => {
    dispatch(updateUserProfileAvatar(avatar));
  };

  const handleEditName = (data: any) => {
    const { first_name, last_name } = data;
    dispatch(
      updateUserProfile(userProfile._id, {
        first_name: first_name,
        last_name: last_name,
      })
    );
  };

  const handleCancel = (invoiceId: string) => {
    dispatch(cancelInvoice(invoiceId));
  }

  const handleCourtSelect = (lng: number, lat: number, id: string) => {
    navigate(navigateToPage(pages.CREATE_COURT_PAGE, id));
  }

  return (
    <main className={styles.main}>
      {contextHolder}
      <div className={styles.inner}>
        <div className={styles.leftSection}>
          <ProfileCard
            isEdit={isEdit}
            onChange={handleChangeAvatar}
            userProfile={userProfile}
            onEditName={handleEditName}
          />
        </div>
        <div className={styles.rightSection}>
          <HistoriesInvoice
            invoiceHistory={invoiceHistory}
            role={userProfile.role}
            onCancel={handleCancel}
          />
          {userProfile.role === "OWNER" && (
            <ListCourtSearchItem
              results={listCourt}
              handleCourtSelect={handleCourtSelect}
            />
          )}
        </div>
      </div>
    </main>
  );
}
