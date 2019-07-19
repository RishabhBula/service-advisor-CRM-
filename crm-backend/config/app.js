const mode = "development"; // test, production, development
const isDev = mode !== "production";
const webURL = isDev ? "localhost:3000" : "serviceadvisor.io/dev";
const s3Key = {
  key: "iIkoc2HZhl+JEMSUFZA2flh/YNtBMCUa3CE/GSbg",
  keyId: "AKIAIBVWQL2OGVIO6D7Q",
  acl: "public-read"
};

const StripeAPIKey = isDev
  ? "sk_test_zCSjOxiIHTNmPJUBdg4hFQAZ"
  : "sk_test_zCSjOxiIHTNmPJUBdg4hFQAZ";

module.exports = {
  mode,
  isDev,
  webURL,
  s3Key,
  StripeAPIKey
};
