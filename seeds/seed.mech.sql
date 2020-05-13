BEGIN;

INSERT INTO users (username, nickname, password)
VALUES
  ('peteryy@gmail.com', 'peter', 'password'),
  ('test123@gmail.com', 'test123', 'password123'),
  ('test456@gmail.com', 'test456', 'password456'),
  ('test789@gmail.com', 'test789', 'password789'),
  ('test012@gmail.com', 'test012', 'password012');

INSERT INTO vinmake (short_vin, make_vin)
VALUES
  ('JTD', 'Toyota'),
  ('19X', 'Honda'),
  ('1G1', 'Chevrolet'),
  ('JHM', 'Honda');

INSERT INTO cars (make, model, vin, user_id, vinmake_id)
VALUES
  ('Toyota', 'Prius', 'JTDKN3DU7F1906819', '1', '1'),
  ('Honda', 'Civic', '19XFC2F83HE211321', '2', '2'),
  ('Chevrolet', 'Corvette', '1G1YB2D70F5107540', '3', '3'),
  ('Toyota', 'Mirai', 'JTDBVRBD3GA000299', '4', '1'),
  ('Honda', 'Clarity', 'JHMZC5F1XJC008004', '5', '2');

INSERT INTO dtc (dtc, description, vinmake_id)
VALUES
  ('P1100','BARO Sensor Circuit','1'),
  ('P1120','Accelerator Pedal Position Sensor Circuit','1'),
  ('P1121','Accelerator Pedal Position Sensor Range/Performance Problem','1'),
  ('P1125','Throttle Control Motor Circuit','1'),
  ('P1106','Barometric Pressure Circuit Range/Performance','2'),
  ('P1107','Barometric Pressure Circuit Low Input','2'),
  ('P1108','Barometric Pressure Circuit High Input','2'),
  ('P1121','Throttle Position Lower Than Expected','2'),
  ('P1674','Tachometer Control Circuit','3'),
  ('P1760','TCM Supply Voltage Interrupted','3'),
  ('P1273','Cooling Fan Control System','3'),
  ('P1212','Accelerator Pedal Position Sensor 1','3'),
  ('P0100','Mass or Volume Air Flow Circuit Malfunction', NULL),
  ('P0101','Mass or Volume Air Flow Circuit Range/Performance Problem', NULL),
  ('P0102','Mass or Volume Air Flow Circuit Low Input', NULL),
  ('P0103','Mass or Volume Air Flow Circuit High Input', NULL);

INSERT INTO comments (comment, vinmake_id, dtc_id, user_id)
VALUES
  ('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non. Adipisci, pariatur. Molestiae, libero esse hic adipisci autem neque?', '1', '1', '1'),
  ('Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.', '1', '2', '2'),
  ('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.', '2', '1', '3'),
  ('Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, consequuntur. Cum quo ea vero, fugiat dolor labore harum aut reprehenderit totam dolores hic quaerat, est, quia similique! Aspernatur, quis nihil?', '2', '2', '4'),
  ('Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet soluta fugiat itaque recusandae rerum sed nobis. Excepturi voluptas nisi, labore officia, nobis repellat rem ab tempora, laboriosam odio reiciendis placeat?', '3', '1', '5'),
  ('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '3', '2', '1'),
  ('Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed, voluptatum nam culpa minus dolore ex nisi recusandae autem ipsa assumenda doloribus itaque? Quos enim itaque error fuga quaerat nesciunt ut?', NULL, '13', '2'),
  ('Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur sequi sint beatae obcaecati voluptas veniam amet adipisci perferendis quo illum, dignissimos aspernatur ratione iusto, culpa quam neque impedit atque doloribus!', NULL, '14', '3');

COMMIT;