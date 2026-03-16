from core.utils.collections import deep_update
from core.utils.setting import get_settings_from_env

# standard settings for project
deep_update(globals(), get_settings_from_env(ENVAR_SETTINGS_PREFIX))  # type: ignore # noqa: F821
# Each developers local settings
# SECURITY WARNING: keep the secret key used in production secret!
# SECRET_KEY = "django-insecure-@u220(#6)3#nup3c=9_(*hdwyes*uo5!qdwfd4m+-3fqpjwv3%"

# NOTE: Do not force DEBUG here. Set it via env (`CORESETTINGS_DEBUG`)
# or local settings.
