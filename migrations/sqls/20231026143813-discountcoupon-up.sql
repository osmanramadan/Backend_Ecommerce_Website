CREATE TABLE IF NOT EXISTS discountcoupon (
    id SERIAL PRIMARY KEY,
    name varchar(255) NOT NULL UNIQUE,
    discount varchar(255) NOT NULL,
    expire date NOT NULL
) 