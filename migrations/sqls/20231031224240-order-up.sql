CREATE TYPE status AS ENUM('waiting', 'complete','cancle');



CREATE TABLE IF NOT EXISTS orders(
    id           SERIAL PRIMARY KEY,
    userinfo     jsonb[] NOT NULL, -- Use jsonb for JSON objects ex:  [{"name": "Osman Ramadan","email": "osman@example.com","phone": "01012345678"}] , Note: you can make it jsonb instead of jsonb[] if you want to store a single JSON object instead of an array of JSON objects.
    address      jsonb[] NOT NULL, -- Use jsonb for JSON objects ex:  [{"country": "Egypt","city": "Damietta","street": "El-Geish St","building": "12A","postal_code": "34511"}] , Note: you can make it jsonb instead of jsonb[] if you want to store a single JSON object instead of an array of JSON objects.
    items        varchar(2000) ARRAY NOT NULL, -- Use varchar array for items ex: {"item1", "item2", "item3"}
    user_id      INT NOT NULL,
    order_status status NOT NULL DEFAULT 'waiting',
    price        DECIMAL(10,2) NOT NULL,
    CONSTRAINT FK_orders_product_users FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);
