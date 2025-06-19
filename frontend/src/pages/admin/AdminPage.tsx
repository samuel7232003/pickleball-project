import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/builder";
import navigateToPage from "../../config/navigate";
import { pages } from "../../router";
import styles from "./AdminPage.module.css";
import { useEffect, useState } from "react";
import { message } from "antd";
import { 
  initializeAdminPage,
  banAccount,
  updateRequestStatusAction,
  selectLoading,
  selectError,
  selectRequests,
  selectLoadingRequests,
  selectRequestsError,
  User,
  Owner,
  Court,
  RequestWithOwner
} from "./AdminPage.duck";
import { roles } from "../../common/constants";
import { REQUEST_STATUS } from "../../services/request";
import text from "../../util/text";

export default function AdminPage() {
  const { role } = useAppSelector((state: any) => state.user.user);
  const { users, owners, courts } = useAppSelector((state: any) => state.adminPage);
  const requests = useAppSelector(selectRequests);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const isLoadingRequests = useAppSelector(selectLoadingRequests);
  const requestsError = useAppSelector(selectRequestsError);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState('requests');

  useEffect(() => {
    if(role !== roles.ADMIN){
      navigate(navigateToPage(pages.WELCOME_PAGE));
      return;
    }
    dispatch(initializeAdminPage());
  }, [role, navigate, dispatch]);

  const handleBanAccount = async (type: string, id: string, isCurrentlyBanned: boolean) => {
    if (!window.confirm(`Bạn có thực sự muốn ${isCurrentlyBanned ? 'bỏ khóa' : 'khóa'} tài khoản này?`)) {
      return;
    }
    dispatch(banAccount(id, isCurrentlyBanned));
  };

  const handleUpdateRequestStatus = async (requestId: string, status: string) => {
    const actionText = status === REQUEST_STATUS.APPROVE ? 'duyệt' : 'từ chối';
    if (!window.confirm(`Bạn có thực sự muốn ${actionText} yêu cầu này?`)) {
      return;
    }
    try {
      await dispatch(updateRequestStatusAction(requestId, status as any));
      message.success(`Đã ${actionText} yêu cầu thành công!`);
    } catch (error) {
      console.error('Failed to update request status:', error);
      message.error(`Không thể ${actionText} yêu cầu. Vui lòng thử lại.`);
    }
  };

  const getFullName = (user: User | Owner) => {
    return `${user.first_name} ${user.last_name}`.trim() || user.username;
  };

  const handleDetailUser = (user: User) => {
    navigate(navigateToPage(pages.PERSONAL_PAGE, user._id));
  };

  const handleDetailOwner = (owner: Owner) => {
    navigate(navigateToPage(pages.PERSONAL_PAGE, owner._id));
  };

  const handleDetailCourt = (court: Court) => {
    navigate(navigateToPage(pages.DETAIL_COURT_PAGE, court._id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case REQUEST_STATUS.PENDING:
        return 'processing';
      case REQUEST_STATUS.APPROVE:
        return 'success';
      case REQUEST_STATUS.DENINE:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case REQUEST_STATUS.PENDING:
        return 'Chờ xét duyệt';
      case REQUEST_STATUS.APPROVE:
        return 'Đã duyệt';
      case REQUEST_STATUS.DENINE:
        return 'Từ chối';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <main className={styles.adminMain}>
      <div className={styles.adminContainer}>
        <div className={styles.sectionSelector}>
          <select 
            value={selectedSection} 
            onChange={(e) => setSelectedSection(e.target.value)}
            className={styles.select}
          >
            <option value="users">{text["AdminPage.users"]}</option>
            <option value="owners">{text["AdminPage.owners"]}</option>
            <option value="courts">{text["AdminPage.courts"]}</option>
            <option value="requests">Yêu cầu rút tiền</option>
          </select>
        </div>

        {/* Users Section */}
        {selectedSection === 'users' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{text["AdminPage.users"]}</h2>
            <div className={styles.listContainer}>
              {users.map((user: User) => (
                <div key={user._id} className={styles.itemCard}>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>
                      {getFullName(user)}
                      {user.isBanned && <span className={styles.bannedBadge}>Đã khóa</span>}
                    </div>
                    <div className={styles.itemDetails}>
                      Username: {user.username} • Role: {user.role}
                    </div>
                  </div>
                  <div className={styles.buttonGroup}>
                    <button 
                      className={`${styles.button} ${user.isBanned ? styles.unbanButton : styles.banButton}`}
                      onClick={() => handleBanAccount('user', user._id, user.isBanned || false)}
                    >
                      {user.isBanned ? 'Bỏ khóa' : 'Khóa'}
                    </button>
                    <button
                      className={styles.button}
                      onClick={() => handleDetailUser(user)}
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Owners Section */}
        {selectedSection === 'owners' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{text["AdminPage.owners"]}</h2>
            <div className={styles.listContainer}>
              {owners.map((owner: Owner) => (
                <div key={owner._id} className={styles.itemCard}>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>
                      {getFullName(owner)}
                      {owner.isBanned && <span className={styles.bannedBadge}>Đã khóa</span>}
                    </div>
                    <div className={styles.itemDetails}>
                      Username: {owner.username}
                    </div>
                  </div>
                  <div className={styles.buttonGroup}>
                    <button 
                      className={`${styles.button} ${owner.isBanned ? styles.unbanButton : styles.banButton}`}
                      onClick={() => handleBanAccount('owner', owner._id, owner.isBanned || false)}
                    >
                      {owner.isBanned ? 'Bỏ khóa' : 'Khóa'}
                    </button>
                    <button
                      className={styles.button}
                      onClick={() => handleDetailOwner(owner)}
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Courts Section */}
        {selectedSection === 'courts' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{text["AdminPage.courts"]}</h2>
            <div className={styles.listContainer}>
              {courts.map((court: Court) => (
                <div key={court._id} className={styles.itemCard}>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{court.name}</div>
                    <div className={styles.itemDetails}>
                      {court.location}
                    </div>
                  </div>
                  <div className={styles.buttonGroup}>
                    <button
                      className={styles.button}
                      onClick={() => handleDetailCourt(court)}
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Requests Section */}
        {selectedSection === 'requests' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Yêu cầu rút tiền</h2>
            {isLoadingRequests ? (
              <div className={styles.loadingContainer}>
                <p>Đang tải danh sách yêu cầu...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className={styles.emptyContainer}>
                <p>Chưa có yêu cầu rút tiền nào</p>
              </div>
            ) : (
              <div className={styles.listContainer}>
                {requests.map((request: RequestWithOwner) => (
                  <div key={request._id} className={styles.itemCard}>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>
                        {request.ownerName}
                        <span className={`${styles.statusBadge} ${styles[`status${request.status}`]}`}>
                          {getStatusText(request.status)}
                        </span>
                      </div>
                      <div className={styles.itemDetails}>
                        <div>Ngân hàng: {request.bankName}</div>
                        <div>Số tài khoản: {request.accountNumber}</div>
                        <div>Chủ tài khoản: {request.accountHolderName}</div>
                        <div>Số tiền: <strong>{formatAmount(request.amount)}</strong></div>
                        <div>Thời gian tạo: {formatDate(request.createdAt || '')}</div>
                        {request.updatedAt && request.updatedAt !== request.createdAt && (
                          <div>Cập nhật lần cuối: {formatDate(request.updatedAt)}</div>
                        )}
                      </div>
                    </div>
                    {request.status === REQUEST_STATUS.PENDING && (
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.button} ${styles.approveButton}`}
                          onClick={() => handleUpdateRequestStatus(request._id!, REQUEST_STATUS.APPROVE)}
                        >
                          Duyệt
                        </button>
                        <button
                          className={`${styles.button} ${styles.denyButton}`}
                          onClick={() => handleUpdateRequestStatus(request._id!, REQUEST_STATUS.DENINE)}
                        >
                          Từ chối
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}