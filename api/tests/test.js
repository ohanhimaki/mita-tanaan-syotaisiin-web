const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");

const { expect } = chai;
chai.use(chaiHttp);

describe("Ravintola", function() {
  describe("#haeRavintolat()", function() {
    it("Palauttaa status 200 ja vähintään yhden rivin vastauksia", done => {
      chai
        .request(app)
        .get("/api/ravintolat")
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).length.greaterThan(0);
          done();
        });
    });
  });
});

describe("Ruokalistat", function() {
  describe("#haeListat()", function() {
    it("Palauttaa status 200 ja vähintään yhden rivin vastauksia", done => {
      chai
        .request(app)
        .get("/api/listat")
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).length.greaterThan(0);
          done();
        });
    });
    it("Testaa ulostulevat kentät", done => {
      chai
        .request(app)
        .get("/api/listat")
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body[0]).to.have.property("restaurantid");
          expect(res.body[0]).to.have.property("date");
          expect(res.body[0]).to.have.property("nimi");
          expect(res.body[0]).to.have.property("lunch");
          done();
        });
    });
  });
});

describe("Kasinpaivitetyt listat", function() {
  describe("#haeListat()", function() {
    it("Palauttaa status 200 ", done => {
      chai
        .request(app)
        .get("/api/handedited")
        .then(res => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});

describe("Read RestaurantGenre", function() {
  describe("#readRestaurantGenre()", function() {
    it("Palauttaa status 200 ja vähintään yhden rivin", done => {
      chai
        .request(app)
        .get("/api/restaurantgenre")
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).length.greaterThan(0);
          done();
        });
    });
  });
});
