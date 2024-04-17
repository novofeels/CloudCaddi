export const getAllHoleDescriptions = async () => {
    return fetch("http://localhost:8088/holeDescriptions").then(res => res.json())

}

export const createHole = async (holeData) => {

      return await fetch("http://localhost:8088/holes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(holeData),
      })
  };
  
  export const createHolyHoleDescriptions = async (holyHoleDescriptions) => {
    
     return await fetch("http://localhost:8088/holyHoleDescriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(holyHoleDescriptions),
      })
  };
  