import { useTranslation } from 'react-i18next';

export default function BookingSort({ options }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {t('booking.sort.title')}
      </h3>
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <input
              type="radio"
              name="sorting"
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
