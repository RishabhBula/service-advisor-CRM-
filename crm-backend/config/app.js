const mode = "development"; // test, production, development
const isDev = mode !== "production";
const webURL = "http://192.168.2.119:3000/";


module.exports = {
  mode,
  isDev,
  webURL
};
