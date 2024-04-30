export const createNewScoreCard = async (scoreCardObj) => {
  return await fetch("http://localhost:8088/scoreCard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(scoreCardObj),
  });
};

export const getAllScoreCards = async () => {
  return fetch("http://localhost:8088/scoreCard").then((res) => res.json());
};

export const createNewHoleScore = async (holeScoreObj) => {
  return await fetch("http://localhost:8088/holeScore", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(holeScoreObj),
  });
};

export const getAllHoleScores = async () => {
  return fetch("http://localhost:8088/holeScore").then((res) => res.json());
};

export const getHoleScoreByScoreCardId = async (scoreCardId) => {
  return fetch(
    `http://localhost:8088/holeScore?scoreCardId=${scoreCardId}`
  ).then((res) => res.json());
};

export const getScoreCardsByUserId = async (userId) => {
  return fetch(`http://localhost:8088/scoreCard?userId=${userId}`).then((res) =>
    res.json()
  );
};

export const updateScoreCardWithScore = async (scoreCard, scoreCardId) => {
  return await fetch(`http://localhost:8088/scoreCard/${scoreCardId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(scoreCard),
  });
};

export const getScoreCardById = async (scoreCardId) => {
  return fetch(
    `http://localhost:8088/scoreCard/${scoreCardId}?_expand=course`
  ).then((res) => res.json());
};

export const patchScoreCard = async (scoreCardId, newScore) => {
  const response = await fetch(
    `http://localhost:8088/scoreCard/${scoreCardId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score: newScore }), // Only send the score property
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return await response.json(); // Return the updated scorecard from the response
};

export const patchHoleScore = async (holeScoreId, newScore) => {
  const response = await fetch(
    `http://localhost:8088/holeScore/${holeScoreId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score: newScore }), // Only send the score property
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return await response.json(); // Return the updated scorecard from the response
};
