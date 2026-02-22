import logging

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,

    "formatters": {
        "colored": {
            "()": "colorlog.ColoredFormatter",
            "format": "%(log_color)s[%(asctime)s] %(levelname)s %(name)s %(message)s",
            "log_colors": {
                "DEBUG": "cyan",
                "INFO": "green",
                "WARNING": "yellow",
                "ERROR": "red",
                "CRITICAL": "bold_red",
            },
        },
    },

    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "level": "DEBUG",
            "formatter": "colored",
        },
    },

    "loggers": {
        "django": {
            "level": "DEBUG",      # reduce Django noise
            "handlers": ["console"],
            "propagate": False,
        },

        "django.utils.autoreload": {
            "level": "WARNING",   # silence file spam
            "handlers": ["console"],
            "propagate": False,
        },

        "django.db.backends": {
            "level": "INFO",      # change to DEBUG if you want SQL
            "handlers": ["console"],
            "propagate": False,
        },

        "core": {
            "level": "DEBUG",     # your app logs fully visible
            "handlers": ["console"],
            "propagate": False,
        },
    },

    "root": {
        "level": "INFO",
        "handlers": ["console"],
    },
}

logger = logging.getLogger(__name__)
