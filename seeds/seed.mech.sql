BEGIN;

INSERT INTO users (username, nickname, password)
VALUES
  ('hayoungsim@gmail.com', 'mike', '@ABCabc123'), 
  ('justinirhee@gmail.com', 'justin', '@ABCabc123'), 
  ('cfcardillo23@gmail.com', 'chris', '@ABCabc123'), 
  ('derekgeryol@gmail.com', 'derek', '@ABCabc123'), 
  ('peteryyoon@gmail.com', 'peter', '@ABCabc123');

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
  ('The Barometric (BARO) Pressure Sensor is built into the Engine Control Module (ECM). This is a semiconductor pressure sensor with properties which cause its electrical resistance to change when stress is applied to the sensor’s crystal (silicon) (piezoelectric effect). This sensor is used to detect the atmospheric (absolute) pressure and outputs corresponding electrical signals.', '1', '1', '1'),
  ('Fluctuations in the air pressure cause changes in the intake air density, which can cause deviations in the air-fuel ratio. The signals from BARO sensor are used to make corrections for these fluctuations. If the ECM detects DTC P1100, the fail safe function operates and the atmospheric pressure is set at a constant 760 mmHg.', '1', '1', '1'),
  ('The P1120 fault code suggests that there is an error in the accelerator pedal’s connection. It will often be accompanied by the Check Engine light. Common causes of this code include: faulty accelerator pedal position sensor, poor electrical connection for accelerator pedal position senor, and harness open or shorted.', '1', '2', '1'),
  ('A code P1106 will be stored when the engine control module (ECM) has detected an abnormally high or low voltage signal from the MAP sensor or BARO sensor, depending on vehicle make and model.', '2', '5', '2'),
  ('The ECM has a BARO sensor built into it in order to monitor the atmospheric pressure. Taking the MAP sensor output voltage and BARO sensor output voltage, the ECM will estimate how much intake airflow is needed.', '4', '5', '4'),
  ('The car might have a software incompatibility issue. Or damaged powertrain control moduel.', '3', '9', '3'),
  ('The MAF (mass air flow) sensor is a sensor mounted in a vehicle''s engine air intake tract downstream from the air filter, and is used to measure the volume and density of air being drawn into the engine. The MAF sensor itself only measures a portion of the air entering and that value is used to calculate the total volume and density of air being ingested.', '2', '13', '2'),
  ('The powertrain control module (PCM) uses that reading along with other sensor parameters to ensure proper fuel delivery at any given time for optimum power and fuel efficiency. This P0100 diagnostic trouble code (DTC) means that there is a detected problem with the Mass Air Flow (MAF) sensor or circuit. The PCM detects that the actual MAF sensor frequency signal is not performing within the normal expected range of the calculated MAF value', '3', '13', '3');

COMMIT;