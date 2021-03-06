CREATE TABLE comments (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  comment TEXT NOT NULL,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
  date_modified TIMESTAMPTZ DEFAULT now() NOT NULL,
  vinmake_id INTEGER
    REFERENCES vinmake(id) ON DELETE CASCADE,
  dtc_id INTEGER
    REFERENCES dtc(id) ON DELETE CASCADE NOT NULL,
  user_id INTEGER
    REFERENCES users(id) ON DELETE SET NULL
)