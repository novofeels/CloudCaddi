import { useEffect, useState } from "react";
import { Outlet, Routes, Route } from "react-router-dom";
import { SideBarComponent } from "../components/NavBar/MySidebarComponent";
import './ApplicationViews.css'; // Make sure this path is correct
import { Hole } from "../components/Holes/Hole";
import { CourseCreate } from "../components/Courses/CourseCreate";

import { CreateHole } from "../components/Holes/CreateHole";
import { NewRound } from "../components/Rounds/NewRound";
import { Welcome } from "../components/Welcome/Welcome";


export const ApplicationViews = () => {
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        const localCaddiUser = localStorage.getItem('Caddi_User');
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
                    <Route path="/" element={<Outlet />} >
                        <Route index element={<Welcome />} />
                        <Route path='/hole' element={<Hole />} />
                        <Route path='/CourseCreate'>
                            <Route index element={<CourseCreate />} />
                            <Route path=':courseId/:holeNum' element={<CreateHole />} />
                        </Route>
                        <Route path='/NewRound' element={<NewRound currentUser={currentUser} />} />
                        <Route path='/ScoreCard/:courseId/:holeNum' element={<Hole currentUser={currentUser}/>}/>
                    </Route>
                </Routes>
            </div>
        </div>
    );
};
