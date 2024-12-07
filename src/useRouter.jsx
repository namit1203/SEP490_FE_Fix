import { useRoutes } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import BookingCar from "./page/BookingCar";
import Bookingconfirmation from "./page/Bookingconfirmation";
import Checkout from "./page/Checkout";
import Convenient from "./page/Convenient";
import DefaultLayout from "./page/DefaultLayout";
import DetaillTicket from "./page/DetaillTicket";
import Home from "./page/Home";
import ForgotPassword from "./page/Forgotpassword";
import PaymentMethod from "./page/PaymentMethod";
import RenterCar from "./page/RenterCar";
import ChangePassword from "./page/profile/ChangePassword";
import Info from "./page/profile/Info";
import MyOrder from "./page/profile/MyOrder";
import Profile from "./page/profile/Profile";
import MyPromotion from "./page/profile/MyPromotion";
import RewardPoints from "./page/profile/RewardPoints";

export default function useRouteElements() {
  const { t } = useTranslation();
  
  const routeElements = useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "*",
      element: (
        <div className="text-center font-bold text-black text-4xl">
          {t('pageNotFound')}
        </div>
      ),
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/profile",
      element: <Profile />,
      children: [
        { index: true, element: <Info /> },
        { path: "change-pass", element: <ChangePassword /> },
        { path: "reward-point", element: <RewardPoints /> },
        { path: "my-order", element: <MyOrder /> },
        { path: "my-promotion", element: <MyPromotion /> },
      ],
    },
    {
      path: "/bookingCar",
      element: <BookingCar />,
    },
    {
      path: "/ticket-detail/:id",
      element: <DetaillTicket />,
    },
    {
      path: "/bookingconfirmation/:id",
      element: <Bookingconfirmation />,
    },
    {
      path: "/payment-method/:id",
      element: <PaymentMethod />,
    },
    { path: "/renter", element: <RenterCar /> },
    { path: "/convenient", element: <Convenient /> },
    {
      path: "/checkout",
      element: <Checkout />,
    },
   
  ]);
  return routeElements;
}
