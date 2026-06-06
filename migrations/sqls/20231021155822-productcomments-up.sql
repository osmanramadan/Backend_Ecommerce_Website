CREATE TABLE IF NOT EXISTS productcomment (
    id SERIAL PRIMARY KEY,
    prodid int NOT NULL,
    text VARCHAR(255) NOT NULL,
    username VARCHAR(50) NOT NULL,
    stars int NOT NULL,
    CONSTRAINT FK_comment_product FOREIGN KEY (prodid) REFERENCES products(id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

