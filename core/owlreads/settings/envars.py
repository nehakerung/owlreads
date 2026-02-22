from core.core.utils.settings import get_settings_from_env
from core.utils.collections import deep_update

# standard settings for project
deep_update(globals(), get_settings_from_env(ENVAR_SETTINGS_PREFIX))  # type: ignore # noqa: F821
# Each developers local settings
