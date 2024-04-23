export const createNewScoreCard = async (scoreCardObj) => {
    
    return await fetch("http://localhost:8088/scoreCard", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(scoreCardObj),
     })
 };


 export const getAllScoreCards = async () => {
    return fetch("http://localhost:8088/scoreCard").then(res => res.json())

}

export const createNewHoleScore = async (holeScoreObj) => {
    
    return await fetch("http://localhost:8088/holeScore", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(holeScoreObj),
     })
 };


 export const getAllHoleScores = async () => {
    return fetch("http://localhost:8088/holeScore").then(res => res.json())

}

export const getHoleScoreByScoreCardId = async (scoreCardId) => {
    return fetch(`http://localhost:8088/holeScore?scoreCardId=${scoreCardId}`).then(res => res.json())
}

export const getScoreCardsByUserId = async (userId) => {
    return fetch(`http://localhost:8088/scoreCard?userId=${userId}`).then(res => res.json())

}