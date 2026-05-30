CREATE TABLE  IF NOT EXISTS  productcat(
    id SERIAL  PRIMARY KEY,
    catname varchar(100) NOT NULL UNIQUE,
    image text   /* Store the image URL for the category, it may be empty */
);