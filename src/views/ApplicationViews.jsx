import { useEffect, useState } from "react"
import { Outlet, Route, Routes } from "react-router-dom"
import { CourseCreate } from "../components/Courses/CourseCreate"
import { NavBar } from "../components/NavBar/NavBar"
import { CreateHole } from "../components/Holes/CreateHole"
import { Hole } from "../components/Holes/Hole"




export const ApplicationViews = () => {
    const [currentUser, setCurrentUser] = useState({})

    useEffect(() => {
        const localCaddiUser = localStorage.getItem('Caddi_User')
        const CaddiUserObject = JSON.parse(localCaddiUser)
    
        setCurrentUser(CaddiUserObject)
      }, [])

    return (
        <Routes>
            <Route path="/" element={
                <>
                    <NavBar currentUser={currentUser} />
                    <Outlet />
                </>
            }>
                <Route index element={<h1>yuh</h1>} />
                <Route path='/hole' element={<Hole />}/>
                
                <Route path='/CourseCreate'>
                     <Route index element={<CourseCreate />} />
                     <Route path=':courseId/:holeNum' element={<CreateHole/>}  />
                </Route>
            </Route>
        </Routes>
    )
}