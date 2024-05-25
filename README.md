<p align="left"> <img src="./media/logo.png" width="250px"/> </p>

# APRSint - APRS Intelligence Extractor ![Pylint-Status](https://github.com/Matzull/TFG/actions/workflows/pylint.yml/badge.svg?branch=master)

**APRSint** is a powerful and user-friendly application designed to extract valuable intelligence from Automatic Packet Reporting System (APRS) signals. With APRSint, you can effortlessly analyze APRS data to gain insights, track assets, and make informed decisions. 

## Features

- **Signal Extraction**: APRSint can decode and extract APRS data, including position, weather, and telemetry information, from incoming signals.

- **Map Visualization**: View APRS data on an interactive map to track the real-time location and status of APRS-equipped assets.

- **Intelligent Insights**: APRSint provides intelligent analysis and reporting tools to help you make informed decisions based on the extracted data.

- **Custom Filters**: Easily filter and organize APRS data based on various criteria to focus on what matters most to you.

- **User-Friendly Interface**: APRSint is designed with a user-friendly interface, making it accessible to both beginners and experienced users.

## Getting Started

1. **Installation**: Clone or download the APRSint repository on your computer. You can download the latest version of APRSint from [here](https://github.com/Matzull/APRSint)

2. **Setup**: Navigate to the folder using 
```bash
cd APRSint
``` 

Install the project dependencies by running the following command in your terminal:

```bash
pip install .
```

3. **Launch**: Once installed, APRSint is ready to use. Run the following command to start the application:

```bash
aprsint --help
```

## Project Structure
``` bash
📦APRSint
 ┣━ 📂app
 ┃ ┣━ 📂cli
 ┃ ┃ ┗━ 📜commands.py
 ┃ ┣━ 📂commons
 ┃ ┃ ┗━ 📜parameters.py
 ┃ ┣━ 📂db
 ┃ ┃ ┗━ 📜schema.py
 ┃ ┣━ 📂interfaces
 ┃ ┃ ┣━ 📜alchemy.py
 ┃ ┃ ┣━ 📜aws.py
 ┃ ┃ ┗━ 📜progress.py
 ┃ ┣━ 📂services
 ┃ ┃ ┣━ 📜aprs_client.py
 ┃ ┃ ┣━ 📜cache.py
 ┃ ┃ ┣━ 📜client_daemon.py
 ┃ ┃ ┣━ 📜db_insert.py
 ┃ ┃ ┗━ 📜s3.py
 ┃ ┣━ 📂shapefiles
 ┃ ┃ ┗━ 📜world.feather
 ┃ ┣━ 📂src
 ┃ ┃ ┣━ 📂web
 ┃ ┃ ┃ ┣━ 📂cache
 ┃ ┃ ┃ ┃ ┗━ 📜map_data.feather
 ┃ ┃ ┃ ┣━ 📂pages
 ┃ ┃ ┃ ┃ ┣━ 📜graph.py
 ┃ ┃ ┃ ┃ ┣━ 📜home.py
 ┃ ┃ ┃ ┃ ┗━ 📜station.py
 ┃ ┃ ┃ ┣━ 📜aprsint.sock
 ┃ ┃ ┃ ┣━ 📜fetch_data_web.py
 ┃ ┃ ┃ ┣━ 📜inteligence.py
 ┃ ┃ ┃ ┣━ 📜name_mapping.py
 ┃ ┃ ┃ ┣━ 📜web.py
 ┃ ┃ ┃ ┗━ 📜wsgi.py
 ┃ ┃ ┣━ 📜inteligence.ipynb
 ┃ ┃ ┗━ 📜interpret.ipynb
 ┃ ┣━ 📂utils
 ┃ ┃ ┣━ 📜buffer.py
 ┃ ┃ ┣━ 📜data_types.py
 ┃ ┃ ┗━ 📜utils.py
 ┃ ┗━ 📜base.py
 ┣━ 📂cache
 ┣━ 📂dags
 ┃ ┣━ 📜aprsint_dag_params.py
 ┃ ┣━ 📜aprsint_dag_params.template.py
 ┃ ┣━ 📜cache_data.py
 ┃ ┣━ 📜download_files.py
 ┃ ┣━ 📜insert_database.py
 ┃ ┗━ 📜upload_files.py
 ┣━ 📂media
 ┃ ┣━ 📜logo.png
 ┃ ┣━ 📜logo.svg
 ┃ ┗━ 📜logo1.png
 ┣━ 📂notebooks
 ┃ ┣━ 📜parse.ipynb
 ┃ ┣━ 📜template.ipynb
 ┃ ┗━ 📜test_s3.ipynb
 ┣━ 📂scripts
 ┃ ┣━ 📜ci.sh
 ┃ ┗━ 📜deploy.sh
 ┣━ 📂testing
 ┃ ┣━ 📜cos.js
 ┃ ┣━ 📜cosmos.py
 ┃ ┣━ 📜network.py
 ┃ ┣━ 📜plot.py
 ┃ ┣━ 📜sigma.py
 ┃ ┗━ 📜test.ipynb
 ┣━ 📜.gitignore
 ┣━ 📜README.md
 ┗━ 📜setup.py
```
## License

This project is licensed under the GPL 3.0 License - see the [LICENSE](LICENSE) file for details.