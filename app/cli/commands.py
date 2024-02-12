########################################################################################################################
# IMPORTS

import logging

import click

########################################################################################################################
# CLI

logger = logging.getLogger(__name__)


@click.group(invoke_without_command=False)
@click.option("--config-path", type=click.Path(exists=True), required=True)
@click.pass_context
def cli(ctx, config_path):
    from ..utils.utils import get_config, set_logger

    # read config and store in context
    cfg = get_config(config_path)
    cfg.add_section("main")
    cfg.set("main", "config_path", config_path)

    ctx.ensure_object(dict)
    ctx.obj["config"] = cfg

    set_logger("INFO")


@cli.command()
@click.option("--drop", is_flag=True)
@click.pass_context
def reset_db(ctx, drop):
    """
    reset all tables from database
    """
    from ..Base import Base

    config = ctx.obj["config"]

    base = Base(config)
    base.alchemy_interface.reset_db([], drop)

    logger.info("success!!!")


@cli.command()
@click.option("--arg", type=click.STRING)
@click.pass_context
def get_data(ctx, arg):
    """
    command
    """
    from ..crawlers.Crawler import Crawler

    config = ctx.obj["config"]

    crawler = Crawler(config)
    crawler.command()

    logger.info(arg)

    logger.info("success!!!")


cli(obj={})
