import { useTranslation } from 'react-i18next';
import { Radio, Space } from 'antd';

export default function BookingSort({ options, selectedOption, onSortChange }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {t('booking.sort.title')}
      </h3>
      <Radio.Group 
        value={selectedOption} 
        onChange={(e) => onSortChange(e.target.value)}
        className="flex flex-col gap-3"
      >
        <Space direction="vertical">
          {options.map((option) => (
            <Radio key={option.id} value={option.id}>
              {option.label}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </div>
  );
}
