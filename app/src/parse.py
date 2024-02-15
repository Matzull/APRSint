import os
import gzip as gz
import aprslib as aprs
import time
import cProfile

def parse():
    packets = []
    success = 0
    error = 0
    st = time.perf_counter_ns()
    with gz.open("/mnt/ssd/database/data_104.txt.gz", "rb") as f:
        for line in f.readlines():
            try:
                packets.append(aprs.parse(line[:-1]))
                success += 1
            # pylint: disable=broad-except
            except Exception as e:
                error += 1
    print(f"Success: {success}, Error: {error}")
    end = time.perf_counter_ns()
    duracion_ns = end - st
    print("La operación tomó {} milisegundos.".format(duracion_ns/1000000))

# cProfile.run("parse()", sort="tottime")
parse()
