import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styles from './PersonalPage.module.css';
import { initializePersonalPage, updateUserProfile, updateUserProfileAvatar } from './PersonalPage.duck';
import { useAppSelector } from '../../redux/builder';
import { AppDispatch } from '../../redux/store';
import ProfileCard from './profileCard/ProfileCard';
import HistoriesInvoice from './historiesInvoice/HistoriesInvoice';
import { message } from 'antd';

export default function PersonalPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [messageApi, contextHolder] = message.useMessage();
  
  const { _id: currentUserId } = useAppSelector((state: any) => state.user.user);
  const { userProfile, invoiceHistory, isLoading, successMessage } = useSelector(
    (state: any) => state.personalPage
  );
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(initializePersonalPage(id, currentUserId));
    }
    if(id === currentUserId){
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
    dispatch(updateUserProfile(userProfile._id, {
      first_name: first_name,
      last_name: last_name
    }));
  };

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
          />
        </div>
      </div>
    </main>
  );
}