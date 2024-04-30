import {
  getHoleScoresByHoleId,
  getHolesByCourseId,
  getHolyHoleDescriptionsByHoleId,
} from "./HoleService";
import { getHoleScoreByScoreCardId } from "./ScoreCardService";

export const deleteCourse = async (courseId) => {
  // Delete the course
  await fetch(`http://localhost:8088/courses/${courseId}`, {
    method: "DELETE",
  });
};

export const deleteHolesByCourseId = async (courseId) => {
  const holes = await getHolesByCourseId(courseId);
  // Delete all holes associated with the course
  await Promise.all(
    holes.map((hole) =>
      fetch(`http://localhost:8088/holes/${hole.id}`, { method: "DELETE" })
    )
  );
};

export const deleteHoleDescriptionsByHoleId = async (holeId) => {
  // You would need a similar getHoleDescriptionsByHoleId function
  const descriptions = await getHolyHoleDescriptionsByHoleId(holeId);
  // Delete all descriptions associated with the hole
  await Promise.all(
    descriptions.map((description) =>
      fetch(`http://localhost:8088/holyHoleDescriptions/${description.id}`, {
        method: "DELETE",
      })
    )
  );
};

export const deleteHoleScoresByHoleId = async (holeId) => {
  const holeScores = await getHoleScoresByHoleId(holeId);
  // Delete all scores associated with the hole
  await Promise.all(
    holeScores.map((score) =>
      fetch(`http://localhost:8088/holeScore/${score.id}`, {
        method: "DELETE",
      })
    )
  );
};

export const deleteScoreCardById = async (scoreCardId) => {
  // Delete the course
  await fetch(`http://localhost:8088/scoreCard/${scoreCardId}`, {
    method: "DELETE",
  });
};

export const deleteHoleScoresByScoreCardId = async (scoreCardId) => {
  const holeScores = await getHoleScoreByScoreCardId(scoreCardId);
  await Promise.all(
    holeScores.map((score) =>
      fetch(`http://localhost:8088/holeScore/${score.id}`, {
        method: "DELETE",
      })
    )
  );
};
