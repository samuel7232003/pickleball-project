import React from 'react';
import { Table, Tag, Spin, Empty, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useSelector } from 'react-redux';
import { Request, REQUEST_STATUS } from '../../services/request';
import styles from './ManagePage.module.css';

interface RequestsListProps {
  requests: Request[];
  isLoading: boolean;
  error: string | null;
}

const RequestsList: React.FC<RequestsListProps> = ({ requests, isLoading, error }) => {
  // Show error message if there's an error
  React.useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

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

  const columns: ColumnsType<Request> = [
    {
      title: 'Thời gian tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (createdAt) => (
        <span>{formatDate(createdAt)}</span>
      ),
    },
    {
      title: 'Ngân hàng',
      dataIndex: 'bankName',
      key: 'bankName',
      width: 200,
      render: (bankName) => (
        <span style={{ fontWeight: 500 }}>{bankName}</span>
      ),
    },
    {
      title: 'Số tài khoản',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
      width: 150,
      render: (accountNumber) => (
        <span style={{ fontFamily: 'monospace' }}>{accountNumber}</span>
      ),
    },
    {
      title: 'Chủ tài khoản',
      dataIndex: 'accountHolderName',
      key: 'accountHolderName',
      width: 200,
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      render: (amount) => (
        <span style={{ fontWeight: 600, color: '#1890ff' }}>
          {formatAmount(amount)}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Cập nhật lần cuối',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
      render: (updatedAt) => (
        <span style={{ fontSize: '12px', color: '#666' }}>
          {formatDate(updatedAt)}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className={styles.requestsListContainer}>
        <div className={styles.requestsListHeader}>
          <h3>Danh sách yêu cầu rút tiền</h3>
        </div>
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <p>Đang tải danh sách yêu cầu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.requestsListContainer}>
      <div className={styles.requestsListHeader}>
        <h3>Danh sách yêu cầu rút tiền</h3>
        <span className={styles.requestCount}>
          Tổng cộng: {requests.length} yêu cầu
        </span>
      </div>
      
      {requests.length === 0 ? (
        <div className={styles.emptyContainer}>
          <Empty 
            description="Chưa có yêu cầu rút tiền nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={requests}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} yêu cầu`,
          }}
          scroll={{ x: 1200 }}
          className={styles.requestsTable}
        />
      )}
    </div>
  );
};

export default RequestsList; 