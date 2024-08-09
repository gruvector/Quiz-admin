import React from "react";
import UserNavbar from "./Navbar/UserNavbar";
import { Outlet } from "react-router-dom";
function UserLayout() {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="outlet md:w-1/5 m-4">
          <UserNavbar />
        </div>
        <div className="task-container w-auto mx-5 md:w-4/5 mt-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default UserLayout;
