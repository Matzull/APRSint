###################################################################################################
# IMPORTS

import logging

import click

###################################################################################################
# CLI

logger = logging.getLogger(__name__)


@click.group(invoke_without_command=False)
@click.option("--config-path", type=click.Path(exists=True), required=True)
@click.pass_context
def cli(ctx, config_path):
    # pylint: disable=import-outside-toplevel
    from ..utils.utils import get_config, set_logger

    # read config and store in context
    cfg = get_config(config_path)
    cfg.add_section("main")
    cfg.set("main", "config_path", config_path)

    ctx.ensure_object(dict)
    ctx.obj["config"] = cfg

    set_logger("WARNING")


@cli.command()
@click.option("--drop", is_flag=True)
@click.pass_context
def reset_db(ctx, drop):
    # pylint: disable=import-outside-toplevel
    """
    reset all tables from database
    """
    from ..base import Base
    from ..db.schema import Station, StationLocation, Messages, QRZProfiles

    config = ctx.obj["config"]

    base = Base(config)
    base.alchemy_interface.reset_db(
        [Station, StationLocation, Messages, QRZProfiles], drop
    )
    base.alchemy_interface.enable_fts(Messages, "comment", "english")

    logger.info("success!!!")


@cli.command()
@click.pass_context
def upload_s3(ctx):
    # pylint: disable=import-outside-toplevel
    """
    updates the s3 bucket with the latest files
    """
    from ..services.s3 import upload_files

    config = ctx.obj["config"]
    upload_files(config)

    logger.info("success!!!")


@cli.command()
@click.pass_context
def download_s3(ctx):
    # pylint: disable=import-outside-toplevel
    """
    downloads the latest files from s3 bucket
    """
    from ..services.s3 import download_files

    config = ctx.obj["config"]
    download_files(config)

    logger.info("success!!!")


@cli.command()
@click.pass_context
def insert_db(ctx):
    # pylint: disable=import-outside-toplevel
    """
    insert data into the database
    """
    from ..base import Base
    from ..services.db_insert import db_insert

    config = ctx.obj["config"]

    base = Base(config)
    db_insert(base)

    logger.info("success!!!")


@cli.command()
@click.pass_context
def cache_data(ctx):
    # pylint: disable=import-outside-toplevel
    """
    cache data from the database to speedup the dashboard
    """
    from ..services.cache import cache

    cache()

    logger.info("success!!!")


cli(obj={})  # pylint: disable=no-value-for-parameter
