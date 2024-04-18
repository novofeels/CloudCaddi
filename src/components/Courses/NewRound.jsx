import { useEffect, useState } from "react"
import { getAllCourses } from "../../services/CourseService"

export const NewRound = ({currentUser}) => {
const [allCourses, setAllCourses] = useState()

useEffect(() => {
getAllCourses().then(courseObjs => setAllCourses(courseObjs))

},[])
}