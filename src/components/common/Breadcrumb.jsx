import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Breadcrumb = ({ items }) => {
  const { t } = useTranslation();

  return (
    <div className="text-sm text-gray-500 mb-4">
      {items.map((item, index) => (
        <span key={index}>
          {index > 0 && <span className="mx-2">&gt;</span>}
          {item.path ? (
            <Link to={item.path} className="text-blue-500 hover:text-blue-600">
              {t(item.text)}
            </Link>
          ) : (
            <span>{t(item.text)}</span>
          )}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb; 