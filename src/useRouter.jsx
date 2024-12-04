import { useRoutes } from "react-router-dom";
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
import HistoryRentDriver from "./page/admin/HistoryRentDriver/HistoryRentDriver";
import ListVehicleRent from "./page/admin/ListVehicleRent/ListVehicleRent";
import LossCostType from "./page/admin/LossCostType/LossCostType";
import TypeOfDriver from "./page/admin/TypeOfDriver/TypeOfDriver";
import Analytics from "./page/admin/analytics/Analytics";
import FixedCosts from "./page/admin/fixedCosts/FixedCosts";
import DriverList from "./page/admin/managerDriver/ListDriver";
import PromotionList from "./page/admin/managerPromotion/PromotionList";
import ListRequest from "./page/admin/managerRequest/ListRequest";
import RequestDetail from "./page/admin/managerRequest/RequestDetail";
import RoleList from "./page/admin/managerRole/RoleList";
import TripList from "./page/admin/managerTrip/TripList";
import UserList from "./page/admin/managerUser/UserList";
import VehicleList from "./page/admin/managerVehicle/ListVehicle";
import DriverCreateTicket from "./page/driver/DriverCreateTicket";
import DriverRequests from "./page/driver/DriverRequest";
import History from "./page/driver/History";
import DriverLogin from "./page/driver/Login"; // Import trang Driver Login
import UpdateTicket from "./page/driver/UpdateTicket";
import ChangePassword from "./page/profile/ChangePassword";
import Info from "./page/profile/Info";
import MyOrder from "./page/profile/MyOrder";
import Profile from "./page/profile/Profile";
import MyPromotion from "./page/profile/MyPromotion";
import RewardPoints from "./page/profile/RewardPoints";

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "*",
      element: (
        <div className="text-center font-bold text-black text-4xl">
          Page not found!
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
    {
      path: "/dashboard",
      element: <DefaultLayout />,
      children: [
        { path: "analytics", element: <Analytics /> },
        { path: "HistoryRentDriver", element: <HistoryRentDriver /> },
        { path: "user", element: <UserList /> },
        { path: "role", element: <RoleList /> },
        { path: "driver", element: <DriverList /> },
        { path: "promotion", element: <PromotionList /> },
        { path: "request", element: <ListRequest /> },
        { path: "request/:id", element: <RequestDetail /> },
        { path: "vehicle", element: <VehicleList /> },
        { path: "lossCostType", element: <LossCostType /> },
        { path: "fixedCosts", element: <FixedCosts /> },
        { path: "trip", element: <TripList /> },
        { path: "typeOfDriver", element: <TypeOfDriver /> },
        { path: "listVehicleRent", element: <ListVehicleRent /> },
      ],
    },
    {
      path: "/driver",

      children: [
        {
          path: "history", // URL: /driver/history
          element: <History />,
        },
        {
          path: "login", // URL: /driver/profile
          element: <DriverLogin />,
        },
        {
          path: "update-ticket", // URL: /driver/update-ticket/:ticketId
          element: <UpdateTicket />,
        },
        {
          path: "create-ticket", // URL: /driver/create-ticket
          element: <DriverCreateTicket />,
        },
        {
          path: "requests", // URL: /driver/requests
          element: <DriverRequests />,
        },
        // Thêm các route con khác nếu cần
      ],
    },
  ]);
  return routeElements;
}
