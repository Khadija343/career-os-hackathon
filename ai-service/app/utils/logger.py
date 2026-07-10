"""Shared logging setup so every module logs consistently."""

import logging

from app.core.config import settings


def get_logger(name: str) -> logging.Logger:
    """Return a configured logger for the given module name."""

    logger = logging.getLogger(name)

    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(
            logging.Formatter("%(asctime)s | %(levelname)s | %(name)s | %(message)s")
        )
        logger.addHandler(handler)
        logger.setLevel(logging.DEBUG if settings.DEBUG else logging.INFO)

    return logger
