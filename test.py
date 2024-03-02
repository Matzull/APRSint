import json
import re

packets_json = json.load(open("/mnt/ssd/database_proccessed" + "/" + "data_2025.json"))


def clean_json(input_string):
    return json.loads(
        json.dumps(input_string)
        .replace("\u0000", " ")
        .replace("\00", " ")
        .replace("\0", " ")
        .replace("\\u0000", " ")
    )


for packet in clean_json(packets_json):
    if re.findall(r"\\u0000", json.dumps(packet)):
        print(packet)
