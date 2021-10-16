const dw = require("../../dw");

exports.salamoi = async (request, response) => {
  try {
    apiresponse = await dw.suoritaDatanLataus(request, response);
  } catch (e) {
    throw e;
  }

  return apiresponse;
};
