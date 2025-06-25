import React, { useState } from 'react';
import styles from './CourtTimeslotTime.module.css';
import { createInvoiceService, updateInvoiceService } from '../../../services/invoice';

interface Timeslot {
  _id: string;
  startTime: string; // e.g. '08:00'
  endTime: string;   // e.g. '09:00'
}

interface CourtTimeslotTimeProps {
  numberCourt: number;
  timeslots: any[];
  timeslotStatus: any[];
  onCellClick?: (slot: any, courtNumber: number, status: string) => void;
}

type TimeslotStatus = 'AVAILABLE' | 'PENDING' | 'UNAVAILABLE';

const statusContent: Record<TimeslotStatus, string> = {
  AVAILABLE: 'Còn trống',
  PENDING: 'Đang chờ',
  UNAVAILABLE: 'Đã được đặt',
};

const CourtTimeslotTime: React.FC<CourtTimeslotTimeProps> = ({ numberCourt, timeslots, timeslotStatus, onCellClick }) => {
  const courts = Array.from({ length: numberCourt }, (_, i) => `Sân ${i + 1}`);

  // Popup state
  const [popup, setPopup] = useState<null | { slot: any; courtNumber: number }>(null);
  const [loading, setLoading] = useState(false);

  // Handler for confirming marking as busy
  const handleConfirm = async () => {
    if (!popup) return;
    setLoading(true);
    try {
      // You may need to adjust userId, ownerId, and courtId as per your app's context
      const { slot, courtNumber } = popup;
      // Dummy values for userId, ownerId, courtId (replace with real values from context/store)
      const userId = 'admin';
      const ownerId = 'admin';
      const courtId = slot.courtId || 'unknown';
      const timeChoice = [{ _id: slot._id, dateChoiced: new Date().toISOString().slice(0,10), numberChoie: courtNumber }];
      // 1. Create invoice with amount=0
      const invoiceRes = await createInvoiceService(userId, ownerId, timeChoice, 0, courtId);
      const invoiceId = invoiceRes.data?._id || invoiceRes.data?.invoice?._id;
      // 2. Update invoice status to 'paid'
      if (invoiceId) {
        await updateInvoiceService(invoiceId, 'paid');
      }
      setPopup(null);
      // Optionally, trigger a refresh here
    } catch (err) {
      alert('Có lỗi xảy ra khi đánh dấu sân!');
    } finally {
      setLoading(false);
    }
  };

  if (!timeslots || timeslots.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div style={{ padding: '24px', textAlign: 'center', fontSize: '1.1rem' }}>
          Sân này hiện không có ca thuê nào
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.timeCol}></th>
            {courts.map((court, idx) => (
              <th key={court} className={styles.courtCol}>{court}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeslots.map((slot, rowIdx) => (
            <tr key={slot._id}>
              <td className={styles.timeCell}>{`${slot.startTime} - ${slot.endTime}`}</td>
              {courts.map((_, colIdx) => {
                // Find the status for this timeslot and court number
                const statusObj = timeslotStatus.find(
                  (s: any) =>
                    s.startTime === slot.startTime &&
                    s.endTime === slot.endTime &&
                    s.courtNumber === colIdx + 1
                );
                const status: TimeslotStatus = statusObj ? statusObj.status : 'AVAILABLE';
                const isAvailable = status === 'AVAILABLE';
                return (
                  <td
                    key={colIdx}
                    className={`${styles.slotCell} ${styles[status]}`}
                    style={isAvailable ? { cursor: 'pointer' } : {}}
                    onClick={isAvailable && typeof onCellClick === 'function' ? () => onCellClick(slot, colIdx + 1, status) : undefined}
                  >
                    {statusContent[status]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Popup confirm */}
      {popup && (
        <div style={{
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, boxShadow: '0 2px 16px #0002', textAlign: 'center' }}>
            <div style={{ fontSize: 18, marginBottom: 24 }}>Đánh dấu sân này đã bận?</div>
            <button onClick={handleConfirm} disabled={loading} style={{ marginRight: 16, padding: '8px 24px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
              {loading ? 'Đang xử lý...' : 'Đồng ý'}
            </button>
            <button onClick={() => setPopup(null)} style={{ padding: '8px 24px', background: '#eee', color: '#333', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourtTimeslotTime; 