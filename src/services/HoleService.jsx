export const getAllHoleDescriptions = async () => {
  return fetch("http://localhost:8088/holeDescriptions").then((res) =>
    res.json()
  );
};

export const createHole = async (holeData) => {
  return await fetch("http://localhost:8088/holes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(holeData),
  });
};

export const createHolyHoleDescriptions = async (holyHoleDescriptions) => {
  return await fetch("http://localhost:8088/holyHoleDescriptions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(holyHoleDescriptions),
  });
};

export const getAllHoles = async () => {
  return fetch("http://localhost:8088/holes").then((res) => res.json());
};

export const getHolesByCourseId = async (courseId) => {
  return fetch(`http://localhost:8088/holes?courseId=${courseId}`).then((res) =>
    res.json()
  );
};

export const getHoleByIdWithEmbed = async (holeId) => {
  return fetch(
    `http://localhost:8088/holes/${holeId}?_embed=holyHoleDescriptions`
  ).then((res) => res.json());
};

export const deleteHolyHoleDescriptionsById = async (descId) => {
  await fetch(`http://localhost:8088/holyHoleDescriptions/${descId}`, {
    method: "DELETE",
  });
};

export const EditHole = async (holeObj, holeId) => {
  return await fetch(`http://localhost:8088/holes/${holeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(holeObj),
  });
};

export const getHolyHoleDescriptionsByHoleId = async (holeId) => {
  return fetch(
    `http://localhost:8088/holyHoleDescriptions?holeId=${holeId}`
  ).then((res) => res.json());
};

export const getHoleScoresByHoleId = async (holeId) => {
  return fetch(`http://localhost:8088/holeScore?holeId=${holeId}`).then((res) =>
    res.json()
  );
};
