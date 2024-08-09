import React from "react";
import { useContext } from "react";
import { Outlet, NavLink } from "react-router-dom";
import TokenContext from "../../context/TokenContext.js";
import "./header.css";
function Header() {
  const adminToken = localStorage.getItem("adminToken");
  const usersToken = localStorage.getItem("userToken");
  const clientName = localStorage.getItem("clientName");
  const { user } = useContext(TokenContext);
  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userToken");
    window.location.href = "/userlogin";
  };

  return (
    <div>
      <nav className="header bg-slate-200 flex justify-between items-center">
        <div className="logo w-1/5 text-center">
          {adminToken ? (
            <NavLink to="/admin">Quiz App</NavLink>
          ) : usersToken ? (
            <NavLink to="/">Quiz App</NavLink>
          ) : (
            "Quiz App"
          )}
          <span className="w-1">&emsp;&emsp;</span>
          {adminToken ? (
            <NavLink to="/manageUser">Users</NavLink>
          ) : usersToken ? (
            <NavLink to="/useranalyze">Analyze</NavLink>
          ) : (
            ""
          )}
        </div>
        <div className="flex justify-between">
          {adminToken || usersToken ? (
            <div className="flex items-center justify-center">
              <p className="mr-5">
                welcome,{" "}
                <span className=" text-xl text-blue-800 capitalize">
                  {user ? user.name : clientName}
                </span>
              </p>
              <button onClick={logout} className="logout mr-4">
                Logout
              </button>
            </div>
          ) : (
            <ul className="flex justify-end gap-3 w-3/4 pr-6">
              <li className="mr-6">
                <NavLink to="/userlogin">User&nbsp;Login</NavLink>
              </li>
              <li className="mr-10">
                <NavLink to="/login">Admin&nbsp;Login</NavLink>
              </li>
            </ul>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export default Header;
