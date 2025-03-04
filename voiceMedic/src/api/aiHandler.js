// require("dotenv").config(); // Load the .env file for environment variables
// const fs = require('fs');
// const { OpenAI } = require("openai");
import * as FileSystem from "expo-file-system";

// Path to JSON file
const fileUri = FileSystem.documentDirectory + "first_aid_responses.json";
// get api key
const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
// Function to get answer from GPT
export const getAnswerFromGPT = async (question) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: question },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch the response from OpenAI");
    }

    // extract data
    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content;

    return answer;

  } catch (error) {
    console.error("Error getting response from GPT:", error);
    return "Sorry, I couldn't get an answer.";
  }
};

// Function to save question and answer to a JSON file
const saveToJSON = async (question, answer) => {
  const data = {
    question: question,
    answer: answer,
  };

  try {
    // Check if the file already exists
    const fileExists = await FileSystem.getInfoAsync(fileUri);

    let responses = [];
    if (fileExists.exists) {
      // If the file exists, read the current content
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      responses = JSON.parse(fileContent);
    }

    // Push the new question-answer pair to the data array
    responses.push(data);

    // Write the updated data back to the file
    await FileSystem.writeAsStringAsync(
      fileUri,
      JSON.stringify(responses, null, 2)
    );
    console.log("Data saved to first_aid_responses.json");
  } catch (error) {
    console.error("Error writing to JSON file:", error);
  }

  // // Read existing data from the JSON file if it exists
  // fs.readFile('first_aid_responses.json', 'utf8', (err, fileData) => {
  //   let responses = [];
  //   if (!err && fileData) {
  //     // If the file exists and contains data, parse it
  //     responses = JSON.parse(fileData);
  //   }

  //   // Push the new question-answer pair to the responses array
  //   responses.push(data);

  //   // Write the updated array back to the JSON file
  //   fs.writeFile('first_aid_responses.json', JSON.stringify(responses, null, 2), (err) => {
  //     if (err) {
  //       console.error('Error writing to JSON file:', err);
  //     } else {
  //       console.log('Data saved to first_aid_responses.json');
  //     }
  //   });
  // });
};
