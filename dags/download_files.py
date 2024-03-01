########################################################################################################################
# IMPORTS

from datetime import datetime, timedelta

from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.operators.empty import EmptyOperator

########################################################################################################################
# DAG

default_args = {
    "owner": "AprsInt",
    "depends_on_past": False,
    "start_date": datetime(2024, 1, 1),
    "retries": 3,
    "retry_delay": timedelta(minutes=1),
    "email": ["marcal16@ucm.es"],
    "email_on_failure": True,
    "email_on_retry": False,
}

dag = DAG(
    dag_id="s3_download",
    default_args=default_args,
    catchup=False,
    schedule_interval="0 5 * * *",  # Every day at 5:00am UTC
)

first_task = EmptyOperator(
    task_id="first_task",
    dag=dag,
)

command = """
    {{ params.interpreter_path }} \
    -m \
    app.cli.commands \
    --config-path {{ params.config_path }} \
    download-s3
"""
task = BashOperator(
    task_id="task_id",
    bash_command=command,
    params={
        "interpreter_path": "/home/matzul/miniforge3/envs/tfg_env/bin/python3",
        "config_path": "/home/matzul/APRSint/config.ini",
        "arg": "test_str",
    },
    dag=dag,
)

print(command)


last_task = EmptyOperator(
    task_id="last_task",
    dag=dag,
)

first_task >> task >> last_task
