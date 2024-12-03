import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import BookingCarViews from "./booking";
export default function BookingCar() {
  return (
    <>
      <Header />
      <div className="w-[1036px] flex flex-col gap-5 m-auto pr-2.5 pt-5 pb-5">
        <BookingCarViews />
      </div>
      <Footer />
    </>
  );
}
