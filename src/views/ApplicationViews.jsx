import { useEffect, useState } from "react";
import { Outlet, Routes, Route } from "react-router-dom";
import { SideBarComponent } from "../components/NavBar/MySidebarComponent";
import "./ApplicationViews.css"; // Make sure this path is correct
import { Hole } from "../components/Holes/Hole";
import { CourseCreate } from "../components/Courses/CourseCreate";

import { CreateHole } from "../components/Holes/CreateHole";
import { NewRound } from "../components/Rounds/NewRound";
import { Welcome } from "../components/Welcome/Welcome";
import { CourseList } from "../components/Courses/CourseList";
import { RoundList } from "../components/Rounds/RoundList";
import { Analytics } from "../components/Analytics/Analytics";
import { CourseDetails } from "../components/Courses/CourseDetails";
import { HoleEdit } from "../components/Holes/HoleEdit";

export const ApplicationViews = () => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const localCaddiUser = localStorage.getItem("Caddi_User");
    const CaddiUserObject = JSON.parse(localCaddiUser);
    setCurrentUser(CaddiUserObject);
  }, []);

  return (
    <div className="app-container">
      <div className="sidebar-container">
        <SideBarComponent currentUser={currentUser} />
      </div>
      <div className="content-container">
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route index element={<Welcome />} />
            <Route path="/hole" element={<Hole />} />
            <Route path="/CourseCreate">
              <Route index element={<CourseCreate />} />
              <Route path=":courseId/:holeNum" element={<CreateHole />} />
            </Route>
            <Route
              path="/NewRound"
              element={<NewRound currentUser={currentUser} />}
            />
            <Route
              path="/scoreCard/:scoreCardId/:courseId/:holeNum"
              element={<Hole currentUser={currentUser} />}
            />
            <Route path="/CourseList" element={<CourseList />} />
            <Route
              path="/RoundList"
              element={<RoundList currentUser={currentUser} />}
            />
            <Route
              path="/Analytics"
              element={<Analytics currentUser={currentUser} />}
            />
            <Route
              path="/CourseDetails/:courseId"
              element={<CourseDetails />}
            />
            <Route path="/HoleEdit/:courseId/:holeId" element={<HoleEdit />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};
