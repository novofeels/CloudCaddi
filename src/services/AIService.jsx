import axios from "axios";

// Replace 'your-api-key' with your actual OpenAI API key
const NOTHING = "sk-proj-ykfEn5j34WPnl5Coc0cqT3BlbkFJOpInJDSQGJVWB7qmGOkP";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

const nicknames = [
  "Nerd",
  "Cupcake",
  "Pookie",
  "Big Daddi",
  "Bad Boiii",
  "Playa",
  "My Dude",
  "Papi",
  "girlllll",
  "Baby",
];
const verbs = ["yeet", "glide", "launch", "send", "fling"];

const getRandomItem = (array) =>
  array[Math.floor(Math.random() * array.length)];

const calculateAverageScore = (holeScores) => {
  const totalScore = holeScores.reduce((acc, score) => acc + score.score, 0);
  return totalScore / holeScores.length;
};

const convertToCardinal = (degree) => {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index = Math.floor((degree + 11.25) / 22.5) % 16;
  return directions[index];
};

export const generateCaddyTip = async (holeScoresHistorical, thisScoreCard) => {
  const historicalScores = holeScoresHistorical
    .map(
      (score) => `
      - par: ${score.par}, Score: ${score.score}, Wind Speed: ${
        score.windSpeed
      } mph, Wind Direction: ${convertToCardinal(
        score.windDirection
      )}, Temperature: ${score.temperature} °F, Humidity: ${
        score.humidity
      } %, Pressure: ${score.pressure} hPa, Description: ${score.description}
    `
    )
    .join("\n");

  const currentWeather = `
    Wind Speed: ${thisScoreCard.windSpeed} mph
    Wind Direction: ${convertToCardinal(thisScoreCard.windDirection)}
    Temperature: ${thisScoreCard.temperature} °F
    Humidity: ${thisScoreCard.humidity} %
    Pressure: ${thisScoreCard.pressure} hPa
    Description: ${thisScoreCard.description}
  `;

  const averageScore = calculateAverageScore(holeScoresHistorical);
  const par = holeScoresHistorical[0]?.par; // Assuming all scores are from the same hole
  const averageComparison = averageScore < par ? "below" : "above";

  const prompt = `
    Given my historical performance on this hole in terms of the weather, and the score related to the par:
    ${historicalScores}

    The average score for this hole is ${averageScore}, and the par is ${par}. This means my average score is ${averageComparison} par.

    And the current weather conditions for this round I'm playing right now:
    ${currentWeather}

    Provide a tip like a curmudgeonly golf caddy in no more than 200 characters. Be funny, either mention what kind of disc to use, or something similar to that. If mentioning wind direction, never use degrees, convert the degrees into a cardinal direction. 
  `;

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: `You are a curmudgeonly disc golf caddy, a cartoon cloud who is smoking a cigar, who provides wisdom and humor. You give great advice, but are also super unhinged, what some would call "ungovernable", very very quirky fellow. You should always recommend either a safer play or a more aggressive play depending on the information you're sent. you can reference overall performance on this hole. You're always kind of grumpy but very supportive. Call the user '${getRandomItem(
              nicknames
            )}'. Use the word '${getRandomItem(verbs)}' instead of throw.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 85, // Adjust based on your needs
        temperature: 1, // Adjust based on your needs
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${NOTHING}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating caddy tip:", error);
    return "Unable to generate caddy tip at this time.";
  }
};
