import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Calendar, Badge, Tooltip } from "antd";
import type { Dayjs } from "dayjs";
import type { BadgeProps } from "antd";
import styles from "./ManagePage.module.css";
import { initializeManagePage } from "./ManagePage.duck";
import { AppDispatch } from "../../redux/store";
import { pages } from "../../router";
import text from "../../util/text";
import { useAppSelector } from "../../redux/builder";
import navigateToPage from "../../config/navigate";

interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  paymentStatus: string;
  amount: number;
  courtName: string;
  userName: string;
}

const StatisticsSection = () => {
  const statistics = useSelector((state: any) => state.managePage?.statistics || {
    totalCourts: 0,
    activeBookings: 0,
    monthlyRevenue: 0,
    totalUsers: 0,
  });

  return (
    <div className={styles.statisticsSection}>
      <div className={styles.statCard}>
        <h3>{text["ManagePage.totalCourts"]}</h3>
        <p className={styles.statNumber}>{statistics.totalCourts || 0}</p>
      </div>
      <div className={styles.statCard}>
        <h3>{text["ManagePage.activeBookings"]}</h3>
        <p className={styles.statNumber}>{statistics.activeBookings || 0}</p>
      </div>
      <div className={styles.statCard}>
        <h3>{text["ManagePage.monthlyRevenue"]}</h3>
        <p className={styles.statNumber}>{statistics.monthlyRevenue || 0} VNĐ</p>
      </div>
      <div className={styles.statCard}>
        <h3>{text["ManagePage.totalUsers"]}</h3>
        <p className={styles.statNumber}>{statistics.totalUsers || 0}</p>
      </div>
    </div>
  );
};

const getStatusBadgeProps = (status: string): { status: BadgeProps['status']; text: string } => {
  switch (status) {
    case 'paid':
      return { status: 'success', text: 'Đã thanh toán' };
    case 'waiting':
      return { status: 'warning', text: 'Chờ thanh toán' };
    default:
      return { status: 'default', text: status };
  }
};

export default function ManagePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { setCurPage }: any = useOutletContext();
  const navigate = useNavigate();
  const managePageState = useSelector((state: any) => state.managePage || { events: {}, isLoading: true });
  const { _id: idUser } = useAppSelector((state: any) => state.user.user);
  const { events, isLoading } = managePageState;

  useEffect(() => {
    if(idUser){
      setCurPage(pages.MANAGE_PAGE);
      dispatch(initializeManagePage(idUser));
    }
  }, [dispatch, setCurPage, idUser]);

  const onSelect = (date: Dayjs) => {
    console.log(date.format("YYYY-MM-DD"));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleClickEvent = (event: Event) => {
    if(event){
      const { _id } = event;
      navigate(navigateToPage(pages.PAYMENT_PAGE, _id));
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        <StatisticsSection />
        <div className={styles.calendarSection}>
          <Calendar
            onSelect={onSelect}
            cellRender={(date) => {
              const dateStr = date.format("YYYY-MM-DD");
              const dayEvents = events[dateStr] || [];
              
              return dayEvents.length > 0 ? (
                <div className={styles.eventContainer}>
                  {dayEvents.map((event: Event) => {
                    const badgeProps = getStatusBadgeProps(event.paymentStatus);
                    return (
                      <Tooltip 
                        key={event._id} 
                        title={
                          <div>
                            <p><strong>{event.courtName}</strong></p>
                            <p>Số tiền: {event.amount} VNĐ</p>
                          </div>
                        }
                      >
                        <div className={styles.eventItem}>
                          <Badge 
                            status={badgeProps.status} 
                            text={`${event.courtName} - ${event.amount} VNĐ`} 
                            onClick={() => handleClickEvent(event)}
                          />
                        </div>
                      </Tooltip>
                    );
                  })}
                </div>
              ) : null;
            }}
          />
        </div>
      </div>
    </main>
  );
}