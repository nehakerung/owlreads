import os
from pathlib import Path

from split_settings.tools import include, optional

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent

ENVAR_SETTINGS_PREFIX = 'CORESETTINGS_'

LOACL_SETTINGS_PATH = os.getenv(f'{ENVAR_SETTINGS_PREFIX}LOCAL_SETTINGS_PATH')

if not LOACL_SETTINGS_PATH:
    LOACL_SETTINGS_PATH = 'local/settings.dev.py'

if not os.path.isabs(LOACL_SETTINGS_PATH):
    LOACL_SETTINGS_PATH = str(BASE_DIR / LOACL_SETTINGS_PATH)

include(
    'base.py',
    'logging.py',
    'custom.py',
    optional(LOACL_SETTINGS_PATH),
    'envars.py',
    'docker.py',
)
