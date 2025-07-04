import { HiOutlineHome } from "react-icons/hi2";
import { LuCreditCard, LuMapPin, LuPackage, LuUserCog } from "react-icons/lu";
import { NavLink, Outlet } from "react-router";
import ProFastLogo from "../pages/shared/ProFastLogo/ProFastLogo";

const DashboardLayout = () => {
  return (
    <div className="drawer lg:drawer-open">
      {/* Drawer toggle checkbox */}
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main content area */}
      <div className="drawer-content flex flex-col">
        {/* Top navbar for small devices */}
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none">
            <label
              htmlFor="dashboard-drawer"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2">Dashboard</div>
        </div>

        {/* Page content goes here */}
        <Outlet />
      </div>

      {/* Sidebar (drawer-side) */}
      <div className="drawer-side">
        {/* Click outside drawer to close (on small devices) */}
        <label
          htmlFor="dashboard-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        {/* Sidebar menu */}
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 relative">
          <div className="mb-4">
            <ProFastLogo></ProFastLogo>
          </div>
          <li>
            <NavLink to="/dashboard">
              <HiOutlineHome className="inline mr-2" />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/myParcels">
              <LuPackage className="inline mr-2" />
              My Parcels
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/paymentHistory">
              <LuCreditCard className="inline mr-2" />
              Payment History
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/track">
              <LuMapPin className="inline mr-2" />
              Track a Parcel
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/profile">
              <LuUserCog className="inline mr-2" />
              Update Profile
            </NavLink>
          </li>
          {/* ✕ Close button (only on small devices) */}
          <label
            htmlFor="dashboard-drawer"
            className="btn btn-sm btn-error text-white absolute top-4 right-4 lg:hidden"
          >
            ✕
          </label>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
