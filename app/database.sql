-- Create the EstationsAPRS table
CREATE TABLE StationsAPRS (
    id SERIAL PRIMARY KEY,
    callsign VARCHAR(15) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    altitude INT,
    last_update TIMESTAMP,
    CONSTRAINT unique_callsign UNIQUE (callsign)
);

-- Create the MessagesAPRS table
CREATE TABLE MessagesAPRS (
    id SERIAL PRIMARY KEY,
    station_id INT,
    timestamp TIMESTAMP NOT NULL,
    message TEXT,
    FOREIGN KEY (station_id) REFERENCES StationsAPRS(id) ON DELETE CASCADE
);

-- Create the TypesAPRSPackets table
CREATE TABLE TypesAPRSPackets (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    description TEXT
);

-- Create the APRSPackets table
CREATE TABLE APRSPackets (
    id SERIAL PRIMARY KEY,
    station_id INT,
    packet_type_id INT,
    timestamp TIMESTAMP NOT NULL,
    packet_data JSONB,
    FOREIGN KEY (station_id) REFERENCES StationsAPRS(id) ON DELETE CASCADE,
    FOREIGN KEY (packet_type_id) REFERENCES TypesAPRSPackets(id) ON DELETE CASCADE
);
