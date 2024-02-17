import gzip as gz
import aprslib as aprs
import timeit

def parse():
    packets = []
    success = 0
    error = 0
    with gz.open("/mnt/ssd/database/data_104.txt.gz", "rb") as f:
        for line in f.readlines():
            try:
                packets.append(aprs.parse(line[:-1]))
                success += 1
            # pylint: disable=broad-except
            except Exception as e:
                error += 1
    print(f"Success: {success}, Error: {error}")

time = timeit.timeit(lambda: parse(), number=5)
print(f"Tiempo de ejecución: {time/5} segundos")
