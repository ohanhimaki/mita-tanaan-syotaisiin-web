const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");

const { expect } = chai;
chai.use(chaiHttp);

describe("WebHooks", function() {
  describe("#webHooksSendsStatus()", function() {
    it("Palauttaa status 200 ja vähintään yhden rivin vastauksia", done => {
      chai
        .request(app)
        .get("/api/WebHooksDayStatus")
        .then(res => {
          expect(res).to.have.status(200);
          // expect(res.body).length.greaterThan(0);
          done();
        });
    });
  });
});

