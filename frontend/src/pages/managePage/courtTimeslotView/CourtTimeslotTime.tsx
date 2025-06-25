import React from 'react';
import styles from './CourtTimeslotTime.module.css';

interface CourtTimeslotTimeProps {
  numberCourt: number;
}

type TimeslotStatus = 'available' | 'pending' | 'unavailable';

const getTimeslots = () => {
  const slots = [];
  for (let i = 0; i < 24; i++) {
    const start = i.toString().padStart(2, '0') + ':00';
    const end = ((i + 1) % 24).toString().padStart(2, '0') + ':00';
    slots.push(`${start} - ${end}`);
  }
  return slots;
};

const statusContent: Record<TimeslotStatus, string> = {
  available: 'Còn trống',
  pending: 'Đang chờ',
  unavailable: 'Đã được đặt',
};

const CourtTimeslotTime: React.FC<CourtTimeslotTimeProps> = ({ numberCourt }) => {
  const timeslots = getTimeslots();
  const courts = Array.from({ length: numberCourt }, (_, i) => `Sân ${i + 1}`);

  // For now, all slots are 'available'. In the future, this can be replaced with real data.
  const getStatus = (_row: number, _col: number): TimeslotStatus => 'available';

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
            <tr key={slot}>
              <td className={styles.timeCell}>{slot}</td>
              {courts.map((_, colIdx) => {
                const status = getStatus(rowIdx, colIdx);
                return (
                  <td
                    key={colIdx}
                    className={`${styles.slotCell} ${styles[status]}`}
                  >
                    {statusContent[status]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourtTimeslotTime; 