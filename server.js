const connection = require("./config/connection");
const mainMenu = require("./routes/roster");

connection.connect((err) => {
  if (err) throw err;
  mainMenu();
});
