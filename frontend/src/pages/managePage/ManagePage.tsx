import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Calendar, Badge, Tooltip, Modal, Input, Form, message, AutoComplete } from "antd";
import type { Dayjs } from "dayjs";
import type { BadgeProps } from "antd";
import styles from "./ManagePage.module.css";
import { initializeManagePage, createRequest } from "./ManagePage.duck";
import { AppDispatch } from "../../redux/store";
import { pages } from "../../router";
import text from "../../util/text";
import { useAppSelector } from "../../redux/builder";
import navigateToPage from "../../config/navigate";
import ButtonIcon from "../../components/buttons/ButtonIcon";
import { getIcon, iconsName } from "../../util/getAssets";
import { normalizeVietnameseName } from "../../common/functions";
import RequestsList from "./RequestsList";

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

interface Bank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
  support: number;
  isTransfer: number;
  swift_code: string;
}

interface BankApiResponse {
  code: string;
  desc: string;
  data: Bank[];
}

const StatisticsSection = () => {
  const statistics = useSelector((state: any) => state.managePage?.statistics || {
    totalCourts: 0,
    activeBookings: 0,
    monthlyRevenue: 0,
    totalUsers: 0,
    totalPayout: 0,
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

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
        <p className={styles.statNumber}>{formatAmount(statistics.monthlyRevenue || 0)}</p>
      </div>
      <div className={styles.statCard}>
        <h3>{text["ManagePage.totalUsers"]}</h3>
        <p className={styles.statNumber}>{statistics.totalUsers || 0}</p>
      </div>
      <div className={styles.statCard}>
        <h3>{text["ManagePage.totalPayout"]}</h3>
        <p className={styles.statNumber}>{formatAmount(statistics.totalPayout || 0)}</p>
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
  const { events, isLoading, isCreatingRequest, requestError, requests, isLoadingRequests, requestsError } = managePageState;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [banks, setBanks] = useState<Bank[]>([]);
  const [bankOptions, setBankOptions] = useState<{ value: string; label: string; logo: string; shortName: string }[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);

  // Fetch banks from VietQR API
  const fetchBanks = async () => {
    try {
      setIsLoadingBanks(true);
      const response = await fetch('https://api.vietqr.io/v2/banks');
      const data: BankApiResponse = await response.json();
      
      if (data.code === '00' && data.data) {
        setBanks(data.data);
        const options = data.data.map(bank => ({
          value: bank.name,
          label: `${bank.shortName} - ${bank.name}`,
          logo: bank.logo,
          shortName: bank.shortName
        }));
        setBankOptions(options);
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
      message.error('Không thể tải danh sách ngân hàng');
    } finally {
      setIsLoadingBanks(false);
    }
  };

  useEffect(() => {
    if(idUser){
      setCurPage(pages.MANAGE_PAGE);
      dispatch(initializeManagePage(idUser));
    }
  }, [dispatch, setCurPage, idUser]);

  // Fetch banks when modal opens
  useEffect(() => {
    if (isModalOpen && banks.length === 0) {
      fetchBanks();
    }
  }, [isModalOpen, banks.length]);

  // Show error messages for request errors
  useEffect(() => {
    if (requestError) {
      message.error(requestError);
    }
  }, [requestError]);

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

  const onSubmitRequest = () => {
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Normalize the account holder name before submission
      const normalizedValues = {
        ...values,
        accountHolderName: normalizeVietnameseName(values.accountHolderName)
      };
      
      // Dispatch the create request action
      await dispatch(createRequest(normalizedValues, idUser));
      
      // Show success message
      message.success("Đề nghị của bạn đã được gửi đến cho Quản trí viên xét duyệt, vui lòng đợi kết quả");
      setIsModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      // Show error message if it's not a validation error
      if (err.message) {
        message.error(err.message || "Có lỗi xảy ra khi gửi đề nghị");
      }
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
        
        {/* Requests List Component */}
        <RequestsList 
          requests={requests}
          isLoading={isLoadingRequests}
          error={requestsError}
        />
      </div>
      
      <ButtonIcon
        onClick={onSubmitRequest}
        mainElement={styles.btnSubmit}
        icon={getIcon({ nameIcon: iconsName.MONEY })}
        content={text["ManagePage.request"]}
      />
      
      <Modal
        open={isModalOpen}
        title={text["ManagePage.titleRequest"]}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
        confirmLoading={isCreatingRequest}
        okText={text["ManagePage.sendRequest"]}
        cancelText={text["ManagePage.cancel"]}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label={text["ManagePage.accountNumber"]}
            name="accountNumber"
            rules={[{ required: true, message: text["ManagePage.accountNumberRequired"] }]}
          >
            <Input placeholder={text["ManagePage.accountNumberPlaceholder"]} maxLength={30} />
          </Form.Item>
          <Form.Item
            label={text["ManagePage.bankName"]}
            name="bankName"
            rules={[{ required: true, message: text["ManagePage.bankNameRequired"] }]}
          >
            <AutoComplete
              placeholder={text["ManagePage.bankNamePlaceholder"]}
              options={bankOptions}
              filterOption={(inputValue, option) =>
                option?.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
              }
              notFoundContent={isLoadingBanks ? "Đang tải..." : "Không tìm thấy ngân hàng"}
              allowClear
              optionRender={(option) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img 
                    src={option.data?.logo} 
                    alt={option.data?.shortName}
                    style={{ 
                      width: '24px', 
                      height: '24px', 
                      objectFit: 'contain',
                      borderRadius: '4px'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span>{option.label}</span>
                </div>
              )}
            />
          </Form.Item>
          <Form.Item
            label={text["ManagePage.accountHolderName"]}
            name="accountHolderName"
            rules={[{ required: true, message: text["ManagePage.accountHolderNameRequired"] }]}
          >
            <Input placeholder={text["ManagePage.accountHolderNamePlaceholder"]} maxLength={50} />
          </Form.Item>
          <Form.Item
            label={text["ManagePage.amount"]}
            name="amount"
            rules={[
              { required: true, message: text["ManagePage.amountRequired"] },
              { pattern: /^\d+$/, message: text["ManagePage.amountPattern"] },
            ]}
          >
            <Input placeholder={text["ManagePage.amountPlaceholder"]} maxLength={12} />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
}