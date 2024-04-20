export const CreateCourse = async (courseObj) => {
    return await fetch(`http://localhost:8088/courses`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(courseObj)
    })
}

export const getAllCourses = async () => {
    return await fetch("http://localhost:8088/courses").then(res => res.json())
}