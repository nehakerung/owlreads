LOGGING['formatters']['colored'] = {  # type: ignore # noqa: F821
    '()': 'colorlog.ColoredFormatter',  # type: ignore # noqa: F821
    'format': '%(log_color)s[%(asctime)s] %(levelname)s %(name)s %(message)s',
}
LOGGING['handlers']['core']['level'] = 'DEBUG'  # type: ignore # noqa: F821
LOGGING['handlers']['console']['formatter'] = 'colored'  # type: ignore # noqa: F821
LOGGING['handlers']['console']['level'] = 'DEBUG'  # type: ignore # noqa: F821
LOGGING['handlers']['console']['formatter'] = 'colored'  # type: ignore # noqa: F821
