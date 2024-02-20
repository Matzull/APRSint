import os
import gzip
from tqdm import tqdm


class Buffer:
    def __init__(
        self, base_dir, buffer_length=100, max_buffers_per_file=50, debug=False
    ):
        self.data = []
        self.base_dir = base_dir
        self.buffer_length = buffer_length
        self.buffers_in_file = 0
        self.max_buffers_per_file = max_buffers_per_file
        self.iterations = self.get_last_file()
        self.buffers_in_file = 0
        self.debug = debug
        if debug:
            self.progress_bar = tqdm(total=max_buffers_per_file, desc="Filling buffer")

    def append(self, data):
        if len(self.data) + 1 > self.buffer_length:
            if self.debug:
                self.progress_bar.update(1)
            self.buffers_in_file += 1
            self.write_to_file()
        self.data.append(data)

    def get_last_file(self) -> int:
        files = os.listdir(self.base_dir)
        if files:
            files.sort(reverse=True)
            last_file = files[0]
            index = int(last_file.split("_")[1].split(".")[0])
            return index + 1
        else:
            return 0

    def write_to_file(self):
        if self.buffers_in_file > self.max_buffers_per_file:
            with open(f"{self.base_dir}/data_{self.iterations}", "rb") as f:
                with gzip.open(
                    f"{self.base_dir}/data_{self.iterations}.gz", "wb"
                ) as zip_file:
                    for line in f:
                        zip_file.write(line)
            os.remove(f"{self.base_dir}/data_{self.iterations}")
            self.buffers_in_file = 0
            self.iterations += 1
            if self.debug:
                self.progress_bar.reset()
                print("\033[4A\033[2K", end="")
        with open(f"{self.base_dir}/data_{self.iterations}", "ab") as f:
            for packet in self.data:
                f.write(packet + b"\n")
        self._flush()

    def _flush(self):
        self.data = []
