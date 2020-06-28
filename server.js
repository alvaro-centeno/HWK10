const connection = require("./Assets/connection");
const roster = require("./routes/roster");

connection.connect((err) => {
  if (err) throw err;
  init();
});

const init = () => {
  roster();
};
