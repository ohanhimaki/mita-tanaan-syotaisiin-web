const dw = require("../../dw");

exports.salamoi = async (request, response) => {
  let apiresponse;
  if (
    !request.header("apiKey") ||
    request.header("apiKey") !== process.env.API_KEY
  ) {
    return response.status(401).json({
      status: "error",
      message: "Unauthorized."
    });
  }
  try {
    apiresponse = await dw.suoritaDatanLataus();
  } catch (e) {
    throw e;
  }

  return apiresponse;
};
