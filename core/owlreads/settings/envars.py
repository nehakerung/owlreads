from core.core.utils.collections import deep_update
from core.core.utils.setting import get_settings_from_env

# standard settings for project
deep_update(globals(), get_settings_from_env(ENVAR_SETTINGS_PREFIX))  # type: ignore # noqa: F821
