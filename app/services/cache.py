import os
import app.src.web.fetch_data_web as fw


def cache():
    base_dir = "/home/matzul/APRSint/app/src/web"
    home_fetcher = fw.HomeFetcher(base_dir)
    # Cache map data
    # if os.path.exists(base_dir + "/cache/map_data.feather"):
    # os.remove(base_dir + "/cache/map_data.feather")
    # home_fetcher.cache_map()
    if os.path.exists(base_dir + "/assets/graph.csv"):
        os.remove(base_dir + "/assets/graph.csv")
    home_fetcher.cache_graph()
