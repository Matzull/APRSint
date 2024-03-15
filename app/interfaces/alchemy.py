###################################################################################################
# IMPORTS

import logging
from urllib.parse import quote_plus
from tqdm import tqdm
from sqlalchemy import create_engine, DDL, select, and_, column, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.postgresql import insert
import pandas as pd

###################################################################################################
# CLASSES

logger = logging.getLogger(__name__)


class AlchemyInterface:
    def __init__(self, config):
        if "db" in config:
            self.config = config["db"]

            self.engine = create_engine(self.get_conn_str())
            self.session = sessionmaker(bind=self.engine)()
            self.cursor = self.session.connection().connection.cursor()

        else:
            logger.warning("no db section in config")

    def get_conn_str(self):
        return (
            f'{self.config["engine"]}://'
            f'{self.config["user"]}:{quote_plus(self.config["password"])}'
            f'@{self.config["host"]}:{self.config["port"]}'
            f'/{self.config["database"]}'
        )

    @staticmethod
    def get_schema_from_table(table):
        schema = "public"

        if isinstance(table.__table_args__, tuple):
            for table_arg in table.__table_args__:
                if isinstance(table_arg, dict) and "schema" in table_arg:
                    schema = table_arg["schema"]

        elif isinstance(table.__table_args__, dict):
            if "schema" in table.__table_args__:
                schema = table.__table_args__["schema"]

        if schema == "public":
            logger.warning(f"no database schema provided, switching to {schema}...")

        return schema

    def create_tables(self, tables):
        for table in tables:
            schema = self.get_schema_from_table(table)

            with self.engine.begin() as conn:
                conn.execute(DDL(f"CREATE SCHEMA IF NOT EXISTS {schema}"))

                if not conn.dialect.has_table(conn, table.__tablename__, schema=schema):
                    logger.info(f"creating table {table.__tablename__}...")
                    table.__table__.create(conn)

                else:
                    logger.info(f"table {table.__tablename__} already exists")

    def drop_tables(self, tables):
        for table in tables:
            schema = self.get_schema_from_table(table)

            with self.engine.begin() as conn:
                if conn.dialect.has_table(conn, table.__tablename__, schema=schema):
                    logger.info(f"dropping table {table.__tablename__}...")
                    conn.execute(
                        DDL(f"DROP TABLE {schema}.{table.__tablename__} CASCADE")
                    )

    def reset_db(self, tables, drop):
        if drop:
            self.drop_tables(tables)

        self.create_tables(tables)

    def insert_alchemy_objs(self, alchemy_objs):
        self.session.add_all(alchemy_objs)
        self.session.commit()

    def insert_alchemy_obj(self, alchemy_obj, silent=False):
        try:
            if not silent:
                logger.info(f"adding {alchemy_obj}...")

            self.session.add(alchemy_obj)
            self.session.commit()

        except Exception:
            if not silent:
                logger.info(f"{alchemy_obj} already in db")

            self.session.rollback()

    def bulk_insert_alchemy_objs(self, alchemy_objs, table, dict=False):
        for i in tqdm(range(0, len(alchemy_objs), 250)):
            batch = alchemy_objs[i : i + 250]
            self.session.execute(
                insert(table)
                .values([(obj.as_dict() if not dict else obj) for obj in batch])
                .on_conflict_do_nothing()
            )
        self.session.commit()

    def bulk_insert_alchemy_dicts(self, alchemy_dicts, table):
        try:
            with self.engine.begin() as conn:
                conn.execute(table.__table__.insert(), alchemy_dicts)
        except Exception as e:
            logger.error(f"Couldnt insert objects with error {e}")

    def adapt_data(self, data):
        return ("'" + data + "'") if isinstance(data, str) else data

    def select_obj(self, table, columns=None, limit=None, df=False, **filters):
        if not columns or columns == "*":
            selected_columns = [column(col) for col in table.__columns__]
        else:
            selected_columns = [column(col) for col in columns]
        statement = select(*selected_columns).select_from(table)
        if limit is not None:
            statement = statement.fetch(limit)
        if filters:
            statement = statement.where(
                and_(
                    *[
                        text(f"{col} = {self.adapt_data(value)}")
                        for col, value in filters.items()
                    ]
                )
            )
        result = self.session.execute(statement).all()
        header = table.__columns__ if (not columns or columns == "*") else columns
        if df:
            return pd.DataFrame().from_records(result, columns=header)
        result.insert(0, tuple(header))
        return result
