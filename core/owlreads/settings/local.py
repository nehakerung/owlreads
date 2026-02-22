import colorlog

LOGGING['formatters']['colored'] = { # type: ignore
    '()': 'colorlog.ColoredFormatter', # type: ignore
    'format': '%(log_color)s[%(asctime)s] %(levelname)s %(name)s %(message)s',
}
LOGGING['handlers']['core']['level'] = 'DEBUG'# type: ignore
LOGGING['handlers']['console']['formatter'] = 'colored'# type: ignore
LOGGING['handlers']['console']['level'] = 'DEBUG'# type: ignore
LOGGING['handlers']['console']['formatter'] = 'colored'# type: ignore