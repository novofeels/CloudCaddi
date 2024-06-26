import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createHole,
  createHolyHoleDescriptions,
  getAllHoleDescriptions,
} from "../../services/HoleService";
import "./CreateHole.css"; // Import the CSS file
import { getCourseById } from "../../services/CourseService";

export const CreateHole = () => {
  const { courseId, holeNum } = useParams();
  const navigate = useNavigate();
  const [holeDescriptions, setHoleDescriptions] = useState([]);
  const [par, setPar] = useState("");
  const [distance, setDistance] = useState("");
  const [selectedDescriptions, setSelectedDescriptions] = useState([]);
  const [animate, setAnimate] = useState(false);

  const [fileURL, setFileURL] = useState(null);
  const [thisCourse, setThisCourse] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    getAllHoleDescriptions().then(setHoleDescriptions);
    getCourseById(parseInt(courseId)).then((courseObj) =>
      setThisCourse(courseObj)
    );

    console.log(holeNum);
  }, [holeNum, courseId]);

  useEffect(() => {
    console.log(thisCourse);
  }, [thisCourse]);
  const handleCreateHole = async () => {
    try {
      const holeData = {
        courseId: parseInt(courseId),
        holeNumber: parseInt(holeNum),
        par: parseInt(par),
        distance: parseInt(distance),
        image: fileURL,
      };

      const holeResponse = await createHole(holeData);
      const holeId = (await holeResponse.json()).id;

      await Promise.all(
        selectedDescriptions.map((descriptionId) => {
          return createHolyHoleDescriptions({
            holeId,
            holeDescriptionId: descriptionId,
          });
        })
      );

      // Reset states
      setPar("");
      setDistance("");
      setSelectedDescriptions([]);

      setFileURL(null);

      const nextHoleNum = parseInt(holeNum) + 1;

      setAnimate(true);

      navigate(`/CourseCreate/${courseId}/${nextHoleNum}`);
    } catch (error) {
      console.error("Error creating hole:", error);
    }
  };

  const handleImageChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.log("No file selected or file access error.");
      return; // Return early if no files are selected
    }

    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setFileURL(event.target.result); // Set the file URL to the loaded data URL of the file
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };

      reader.readAsDataURL(selectedFile);
    } else {
      console.log("Failed to load file because the file is undefined.");
    }
  };

  const handleDescriptionClick = (descriptionId) => {
    const index = selectedDescriptions.indexOf(descriptionId);
    if (index === -1) {
      setSelectedDescriptions([...selectedDescriptions, descriptionId]);
    } else {
      const updatedDescriptions = [...selectedDescriptions];
      updatedDescriptions.splice(index, 1);
      setSelectedDescriptions(updatedDescriptions);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFinish = async () => {
    try {
      const holeData = {
        courseId: parseInt(courseId),
        holeNumber: parseInt(holeNum),
        par: parseInt(par),
        distance: parseInt(distance),
        image: fileURL,
      };

      const holeResponse = await createHole(holeData);
      const holeId = (await holeResponse.json()).id;

      await Promise.all(
        selectedDescriptions.map((descriptionId) => {
          return createHolyHoleDescriptions({
            holeId,
            holeDescriptionId: descriptionId,
          });
        })
      );

      // Reset states
      setPar("");
      setDistance("");
      setSelectedDescriptions([]);

      setFileURL(null);

      const nextHoleNum = parseInt(holeNum) + 1;
      navigate(`/CourseList`);
    } catch (error) {
      console.error("Error creating hole:", error);
    }
  };
  if (thisCourse) {
    console.log(thisCourse);
    return (
      <div className="create-hole-container" key={holeNum}>
        <div className="form-section2">
          <h2 className="centerThis2">{thisCourse.name}</h2>
          <h2 className="centerThis">Hole {holeNum}</h2>
          <div className="form-field">
            <label className="parLabel">Par:</label>
            <input
              className="createHoleInput parInputField"
              type="number"
              value={par}
              onChange={(e) => setPar(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Distance:</label>
            <input
              className="createHoleInput"
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            />
          </div>
          <h3>Select Hole Descriptions:</h3>
          <div className="newBigDiv">
            <div className="smallDiv1">
              {holeDescriptions.map((description) => (
                <div key={description.id} className="description-item">
                  <input
                    className="createHoleInput"
                    type="checkbox"
                    checked={selectedDescriptions.includes(description.id)}
                    onChange={() => handleDescriptionClick(description.id)}
                    style={{ marginRight: "5px" }}
                  />
                  <label>{description.description}</label>
                </div>
              ))}
            </div>
            <div classname="smallDiv2">
              <div className="image-section image-container">
                <label>Image:</label>
                <div>
                  <button
                    type="button"
                    className="button image-upload-button"
                    onClick={triggerFileInput}
                  >
                    Upload Image
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
                {fileURL && (
                  <img
                    src={fileURL}
                    alt="Selected"
                    style={{ maxWidth: "175px" }}
                  />
                )}
              </div>
            </div>
          </div>
          {parseInt(holeNum) === thisCourse?.numOfHoles ? (
            <button className="button" onClick={handleFinish}>
              Finish Course Creation
            </button>
          ) : (
            <button className="button" onClick={handleCreateHole}>
              Create Next Hole
            </button>
          )}
        </div>
      </div>
    );
  }
};
