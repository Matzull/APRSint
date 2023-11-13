import aprslib as aprs
import gzip as gz
import os

DATA_PATH = "../../database"

packets = []
for file in os.listdir(DATA_PATH):
    if file.endswith(".gz"):
        with gz.open(os.path.join(DATA_PATH, file), 'rb') as f:
            for line in f.readlines():
                try:
                    packets.append(aprs.parse(line[:-1]))
                except Exception as e:
                    print('Error parsing line: ' + line.decode('utf-8') + " " + str(e))