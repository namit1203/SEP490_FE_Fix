import { FiBriefcase, FiClock, FiShield, FiStar } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const Features = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <FiBriefcase className="w-6 h-6" />,
      title: t('home.features.operators.title'),
      description: t('home.features.operators.description')
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: t('home.features.booking.title'),
      description: t('home.features.booking.description')
    },
    {
      icon: <FiShield className="w-6 h-6" />,
      title: t('home.features.payment.title'),
      description: t('home.features.payment.description')
    },
    {
      icon: <FiStar className="w-6 h-6" />,
      title: t('home.features.support.title'),
      description: t('home.features.support.description')
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t('home.features.title')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 