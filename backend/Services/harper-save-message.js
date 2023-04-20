import axios from "axios";

function harperSaveMessage(message, userName, room) {
  const dbURL = process.env.HARPERDB_URL;
  const dbPW = process.env.HARPERDB_PASSWORD;
  if (!dbPW || dbURL) return null;
  var data = JSON.stringify({
    operation: "insert",
    schema: "RealTime_Chat_App",
    table: "message",
    records: [
      {
        message,
        userName,
        room,
      },
    ],
  });

  var config = {
    method: "post",
    url: dbURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: dbPW,
    },
    data: data,
  };
  return new Promise((resolve, reject) => {
    axios(config)
      .then(function (response) {
        resolve(JSON.stringify(response.data));
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export default harperSaveMessage;