# pylint: disable=duplicate-code
###################################################################################################
# IMPORTS
from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.operators.empty import EmptyOperator
import sys

sys.path.append("/home/matzul/APRSint/")
from dags.aprsint_dag_params import default_args, CONFIG_PATH, EXEC_PATH


###################################################################################################
# DAG

dag = DAG(
    dag_id="cache_data",
    default_args=default_args,
    catchup=False,
    schedule_interval="0 9 * * *",  # Every day at 9:00am UTC
)

first_task = EmptyOperator(
    task_id="first_task",
    dag=dag,
)

COMMAND = """
    {{ params.interpreter_path }} \
    -m \
    app.cli.commands \
    --config-path {{ params.config_path }} \
    cache-data
"""
task = BashOperator(
    task_id="task_id",
    bash_command=COMMAND,
    params={
        "interpreter_path": EXEC_PATH,
        "config_path": CONFIG_PATH,
    },
    dag=dag,
)


last_task = EmptyOperator(
    task_id="last_task",
    dag=dag,
)


first_task >> task >> last_task  # pylint: disable=W0104
