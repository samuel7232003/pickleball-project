import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/builder";
import navigateToPage from "../../config/navigate";
import { pages } from "../../router";
import styles from "./AdminPage.module.css";
import { useEffect, useState } from "react";
import { 
  initializeAdminPage,
  banAccount,
  selectLoading,
  selectError,
  User,
  Owner,
  Court
} from "./AdminPage.duck";
import { roles } from "../../common/constants";
import text from "../../util/text";

export default function AdminPage() {
  const { role } = useAppSelector((state: any) => state.user.user);
  const { users, owners, courts } = useAppSelector((state: any) => state.adminPage);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState('users');

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
      </div>
    </main>
  );
}