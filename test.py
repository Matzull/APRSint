import psycopg2

connection_string = "dbname=airflow_db user=airflow_user password=airflow_pass host=localhost"
print("init program")
try:
    # Establecer la conexión
    connection = psycopg2.connect(connection_string)
    print("¡Conexión exitosa!")

    # Realizar operaciones en la base de datos aquí...

except psycopg2.Error as e:
    print("Error al conectar a la base de datos:", e)
finally:
    # Cerrar la conexión cuando hayas terminado
    if connection is not None:
        connection.close()
