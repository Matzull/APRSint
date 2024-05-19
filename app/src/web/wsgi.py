import sys

# add your project directory to the sys.path
project_home = "/home/matzul/APRSint/app/src/web"
if project_home not in sys.path:
    sys.path = [project_home] + sys.path

import web

application = web.app.server
if __name__ == "__main__":
    application.run()
