###################################################################################################
# IMPORTS

import logging
from urllib.parse import quote_plus

from sqlalchemy import create_engine, DDL, select, and_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import sessionmaker
from ..db.schema import AprsPacket

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

            with self.engine.connect() as conn:
                conn.execute(DDL(f"CREATE SCHEMA IF NOT EXISTS {schema}"))
                conn.commit()

                if not conn.dialect.has_table(conn, table.__tablename__, schema=schema):
                    logger.info(f"creating table {table.__tablename__}...")
                    table.__table__.create(conn)
                    conn.commit()

                else:
                    logger.info(f"table {table.__tablename__} already exists")

    def drop_tables(self, tables):
        for table in tables:
            schema = self.get_schema_from_table(table)

            with self.engine.connect() as conn:
                if conn.dialect.has_table(conn, table.__tablename__, schema=schema):
                    logger.info(f"dropping table {table.__tablename__}...")
                    conn.execute(
                        DDL(f"DROP TABLE {schema}.{table.__tablename__} CASCADE")
                    )
                    conn.commit()

    def reset_db(self, tables, drop):
        if drop:
            self.drop_tables(tables)

        self.create_tables(tables)

    def insert_alchemy_obj(self, alchemy_obj, silent=False):
        try:
            if not silent:
                logger.info(f"adding {alchemy_obj}...")

            self.session.add(alchemy_obj)
            self.session.commit()

        except IntegrityError:
            if not silent:
                logger.info(f"{alchemy_obj} already in db")

            self.session.rollback()

    def try_insert(self, alchemy_objs):
        index = 0
        try:
            for index, obj in enumerate(alchemy_objs):
                self.session.add(obj)
            self.session.commit()
        except Exception:
            self.session.rollback()
            self.session.bulk_save_objects(alchemy_objs[:index])
            self.session.commit()
            self.try_insert(alchemy_objs[index + 1 :])
            return

    def bulk_insert_alchemy_objs(self, alchemy_objs):
        bulk_size = 1000
        try:
            for start in range(0, len(alchemy_objs), bulk_size):
                end = min(start + bulk_size, len(alchemy_objs))
                self.session.bulk_save_objects(alchemy_objs[start:end])
                self.session.flush()
            self.session.commit()
        except Exception as e:
            logger.error(f"Couldn bulk insert with error {e}")
            self.session.rollback()
        try:
            self.try_insert(alchemy_objs)
        except Exception:
            self.session.rollback()

    def bulk_insert_alchemy_dicts(self, alchemy_dicts):
        try:
            with self.engine.begin() as conn:
                conn.execute(AprsPacket.__table__.insert(), alchemy_dicts)
        except Exception as e:
            logger.error(f"Couldnt insert objects with error {e}")

    def query_raw(self):  # , raw_query):
        # Runs a war query in a database
        select(AprsPacket)
        return self.session.execute(AprsPacket).all()

    def select_query(self, table):  # , filters=None):
        # Runs a query with filters in a database
        statement = select(table)  # .filter_by(**filters)
        return self.session.scalars(statement).all()

    def query_objects(self, columns, table, filters=None):
        # filter format:
        # (age ">") : 18
        # Runs a query with filters in a database
        query = select(columns).select_from(table)

        # Apply filters
        if filters:
            # Filters are a dictionary with column names as keys and values as values
            filter_conditions = [
                (
                    column == value
                    if operand == "=="
                    else (
                        column < value
                        if operand == "<"
                        else column > ">"
                        if operand == ">"
                        else False
                    )
                )
                for (column, operand), value in filters.items()
            ]
            query = query.where(and_(*filter_conditions))

        # Run the query
        return self.session.execute(query).all()
