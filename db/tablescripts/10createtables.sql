CREATE TABLE genreofrestaurant
(
    genreofrestaurantid integer NOT NULL generated ALWAYS AS IDENTITY,
    genreid integer,
    restaurantid integer
);

CREATE TABLE kasinpaivitetytlistat
(
    ravintolaid integer,
    rivi integer,
   teksti varchar(250)
);


CREATE TABLE lunchlist
(
    date integer,
    restaurantid integer,
    lunch varchar(1400)
);


CREATE TABLE lunchofday
(
    paiva numeric,
    nimi VARCHAR(100),
    string_agg varchar(1400),
    restaurantid integer
);

CREATE TABLE lunchofdaytmp
(
    paiva numeric,
    nimi VARCHAR(100),
    string_agg VARCHAR(700),
    restaurantid integer,
    randommultiplier numeric(8,4),
    restaurantmultiplier numeric(8,4),
    genremultiplier numeric(8,4),
    usermultiplier numeric(8,4),
    totalscore numeric(16,8)
);

CREATE TABLE ravintolat
(
    ravintolaid integer NOT NULL generated ALWAYS AS IDENTITY,
    apiid integer,
    nimi VARCHAR(100),
    tassalista integer,
    linkki VARCHAR(200)
);

CREATE TABLE restaurantgenre
(
    genreid integer NOT NULL,
    genrename VARCHAR(100)
);
