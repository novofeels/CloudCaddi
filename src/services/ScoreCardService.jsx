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