export const CreateCourse = async (courseObj) => {
  return await fetch(`http://localhost:8088/courses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(courseObj),
  });
};

export const getAllCourses = async () => {
  return await fetch("http://localhost:8088/courses").then((res) => res.json());
};

export const getCourseById = async (courseId) => {
  return await fetch(`http://localhost:8088/courses/${courseId}`).then((res) =>
    res.json()
  );
};

// Assumes you have functions to get related items like getHolesByCourseId, etc.
