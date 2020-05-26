CREATE TABLE cars (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  vin TEXT,
  vinmake_id INTEGER REFERENCES vinmake(id) ON DELETE CASCADE,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL
)