import { createBrowserRouter } from "react-router";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import RootLayout from "../layouts/RootLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import BeRider from "../pages/BeRider/BeRider";
import Coverage from "../pages/Coverage/Coverage";
import ActiveRiders from "../pages/Dashboard/ActiveRiders/ActiveRiders";
import AssignRider from "../pages/Dashboard/AssignRider/AssignRider";
import ManageAdmins from "../pages/Dashboard/ManageAdmins/ManageAdmins";
import MyParcels from "../pages/Dashboard/MyParcels/MyParcels";
import Payment from "../pages/Dashboard/Payment/Payment";
import PaymentHistory from "../pages/Dashboard/PaymentHistory/PaymentHistory";
import PendingRiders from "../pages/Dashboard/PendingRiders/PendingRiders";
import Forbidden from "../pages/Forbidden/Forbidden";
import Home from "../pages/Home/Home/Home";
import SendParcel from "../pages/SendParcel/SendParcel";
import Loader from "../pages/shared/Loader/Loader";
import AdminRoute from "../routes/AdminRoute";
import PrivateRoute from "../routes/PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "coverage",
        Component: Coverage,
        loader: () => fetch("./warehouses.json"),
      },
      {
        path: "beRider",
        element: (
          <PrivateRoute>
            <BeRider></BeRider>
          </PrivateRoute>
        ),
        loader: () => fetch("./warehouses.json"),
        HydrateFallback: Loader,
      },
      {
        path: "sendParcel",
        element: (
          <PrivateRoute>
            <SendParcel></SendParcel>
          </PrivateRoute>
        ),
        loader: () => fetch("./warehouses.json"),
        HydrateFallback: Loader,
      },
      {
        path: "forbidden",
        Component: Forbidden,
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        path: "myParcels",
        Component: MyParcels,
      },
      {
        path: "payment/:parcelId",
        Component: Payment,
      },
      {
        path: "paymentHistory",
        Component: PaymentHistory,
      },
      {
        path: "AssignRider",
        element: (
          <AdminRoute>
            <AssignRider></AssignRider>
          </AdminRoute>
        ),
      },
      {
        path: "pendingRiders",
        element: (
          <AdminRoute>
            <PendingRiders></PendingRiders>
          </AdminRoute>
        ),
      },
      {
        path: "activeRiders",
        element: (
          <AdminRoute>
            <ActiveRiders></ActiveRiders>
          </AdminRoute>
        ),
      },
      {
        path: "manageAdmins",
        element: (
          <AdminRoute>
            <ManageAdmins></ManageAdmins>
          </AdminRoute>
        ),
      },
    ],
  },
]);
