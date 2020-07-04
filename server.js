const connection = require("./config/connection");
const { initApp } = require(`./lib/app`);
const { initPrompts } = require(`./lib/prompt`);

connection.connect((err) => {
  if (err) throw err;
  initApp();
  initPrompts();
});
