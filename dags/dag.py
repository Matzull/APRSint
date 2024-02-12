########################################################################################################################
# IMPORTS

from datetime import datetime, timedelta

from airflow import DAG
from airflow.operators.bash_operator import BashOperator
from airflow.operators.dummy_operator import DummyOperator

from project_id_dag_params import EXEC_PATH, CONFIG_PATH

########################################################################################################################
# DAG

default_args = {
    'owner': 'WhiteBox',
    'depends_on_past': False,
    'start_date': datetime(2021, 1, 1),
    'retries': 5,
    'retry_delay': timedelta(minutes=1),
    'email': ['info@whiteboxml.com'],
    'email_on_failure': True,
    'email_on_retry': False,
}

dag = DAG(dag_id='project_id',
          default_args=default_args,
          catchup=False,
          schedule_interval='0 0 * * *')

first_task = DummyOperator(
    task_id='first_task',
    dag=dag,
)

command = """
    {{ params.interpreter_path }} \
    --config-path {{ params.config_path }} \
    command \
    --arg '{{ params.arg }}'
"""

task = BashOperator(
    task_id='task_id',
    bash_command=command,
    params={
        'interpreter_path': EXEC_PATH,
        'config_path': CONFIG_PATH,
        'arg': 'test_str',
    },
    dag=dag,
)

last_task = DummyOperator(
    task_id='last_task',
    dag=dag,
)

first_task >> task >> last_task
