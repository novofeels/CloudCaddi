import React from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink, useNavigate } from "react-router-dom";
import "./MySidebarComponent.css";

export const SideBarComponent = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("Caddi_User");
    navigate("/login", { replace: true });
  };

  return (
    <div className="sidebar">
      {" "}
      {/* Assign class for overall sidebar styling */}
      <CDBSidebar
        textColor="#fff"
        backgroundColor="#333"
        className="sidebar-content"
      >
        {" "}
        {/* Assign class for background and text color */}
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a
            href="/"
            className="text-decoration-none"
            style={{ color: "inherit" }}
          >
            CloudCaddi
          </a>
        </CDBSidebarHeader>
        <CDBSidebarContent className="try">
          <CDBSidebarMenu>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "activeClicked" : "")}
            >
              <CDBSidebarMenuItem icon="cloud">CloudCaddi</CDBSidebarMenuItem>
            </NavLink>
            <NavLink
              to="/NewRound"
              className={({ isActive }) => (isActive ? "activeClicked" : "")}
            >
              <CDBSidebarMenuItem icon="plus-circle">
                NEW ROUND
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink
              to="/CourseList"
              className={({ isActive }) => (isActive ? "activeClicked" : "")}
            >
              <CDBSidebarMenuItem icon="book">COURSES</CDBSidebarMenuItem>
            </NavLink>
            <NavLink
              to="/RoundList"
              className={({ isActive }) => (isActive ? "activeClicked" : "")}
            >
              <CDBSidebarMenuItem icon="book">MY ROUNDS</CDBSidebarMenuItem>
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) => (isActive ? "activeClicked" : "")}
            >
              <CDBSidebarMenuItem icon="chart-line">
                Analytics
              </CDBSidebarMenuItem>
            </NavLink>
            <div
              onClick={handleLogout}
              style={{ cursor: "pointer", color: "inherit" }}
            >
              <CDBSidebarMenuItem icon="sign-out-alt">
                LOGOUT
              </CDBSidebarMenuItem>
            </div>
          </CDBSidebarMenu>
        </CDBSidebarContent>
        <CDBSidebarFooter style={{ textAlign: "center" }}>
          <div style={{ padding: "20px 5px" }}>novofeels</div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};
