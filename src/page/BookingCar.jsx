import React from "react";
import { useTranslation } from 'react-i18next';
import Footer from "./Footer";
import Header from "./Header";
import BookingCarViews from "./booking";

export default function BookingCar() {
  const { t } = useTranslation();
  
  return (
    <>
      <Header />
      <div className="w-[1036px] flex flex-col gap-5 m-auto pr-2.5 pt-5 pb-5">
        <h1 className="text-2xl font-bold mb-4">{t('booking.title')}</h1>
        <BookingCarViews />
      </div>
      <Footer />
    </>
  );
}
