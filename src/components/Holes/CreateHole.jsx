import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createHole, createHolyHoleDescriptions, getAllHoleDescriptions } from "../../services/HoleService";

export const CreateHole = () => {
  const { courseId, holeNum } = useParams();
  const navigate = useNavigate();
  const [holeDescriptions, setHoleDescriptions] = useState([]);
  const [par, setPar] = useState("");
  const [distance, setDistance] = useState("");
  const [selectedDescriptions, setSelectedDescriptions] = useState([]);
  const [image, setImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState("")

  // Function to handle posting the hole and hole descriptions
  const handleCreateHole = async () => {
    try {
      // Create the hole object
      const holeData = {
        courseId: parseInt(courseId),
        holeNumber: parseInt(holeNum),
        par: parseInt(par),
        distance: parseInt(distance),
        image: `/uploads/${fileName}` 
      };

      // Create FormData object
      const formData = new FormData();
      formData.append('image', image);
      formData.append('courseId', courseId);
      formData.append('holeNumber', holeNum);
      formData.append('par', par);
      formData.append('distance', distance);

      // Post the hole object and image
      await fetch('http://localhost:8088/upload', {
        method: 'POST',
        body: formData
      });

      // Continue with creating hole and descriptions
      const holeResponse = await createHole(holeData);
      const holeId = (await holeResponse.json()).id;

      await Promise.all(
        selectedDescriptions.map(async descriptionId => {
          const holyHoleDescription = {
            holeId,
            holeDescriptionId: descriptionId
          };
          await createHolyHoleDescriptions(holyHoleDescription);
        })
      );

      // Navigate to the next hole creation page
      const nextHoleNum = parseInt(holeNum) + 1;
      navigate(`/CourseCreate/${courseId}/${nextHoleNum}`);

      // Reset the state variables
      setPar("");
      setDistance("");
      setSelectedDescriptions([]);
      setImage(null);
      setUploadedFile(null);
    } catch (error) {
      console.error("Error creating hole:", error);
    }
  };

  // Function to handle clicking on a hole description
  const handleDescriptionClick = descriptionId => {
    const index = selectedDescriptions.indexOf(descriptionId);
    if (index === -1) {
      setSelectedDescriptions([...selectedDescriptions, descriptionId]);
    } else {
      const updatedDescriptions = [...selectedDescriptions];
      updatedDescriptions.splice(index, 1);
      setSelectedDescriptions(updatedDescriptions);
    }
  };

  // Function to handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFileName(file.name)
    setImage(file);
    setUploadedFile(URL.createObjectURL(file)); // Store uploaded file for display
  };

  useEffect(() => {
    // Fetch hole descriptions on component mount
    getAllHoleDescriptions().then(holeObjs => setHoleDescriptions(holeObjs));
  }, []);

  return (
    <div>
      <h2>Creating Hole {holeNum}</h2>
      <label>Par:</label>
      <input type="number" value={par} onChange={e => setPar(e.target.value)} />
      <label>Distance:</label>
      <input type="number" value={distance} onChange={e => setDistance(e.target.value)} />
      <label>Image:</label>
      <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
      {uploadedFile && <img src={uploadedFile} alt="Uploaded" style={{ maxWidth: "100px" }} />} {/* Display uploaded file */}
      <h3>Select Hole Descriptions:</h3>
      {holeDescriptions.map(description => (
        <div key={description.id}>
          <input
            type="checkbox"
            checked={selectedDescriptions.includes(description.id)}
            onChange={() => handleDescriptionClick(description.id)}
          />
          <label>{description.description}</label>
        </div>
      ))}
      <button onClick={handleCreateHole}>Finish Hole Creation</button>
      <button onClick={handleCreateHole}>Create Next Hole</button>
    </div>
  );
};
