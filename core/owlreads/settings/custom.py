from decouple import config

"""
Settings specific to this application only (no Django or third-party settings).
"""

IN_DOCKER = False
GOOGLE_BOOKS_API_KEY = config('GOOGLE_BOOKS_API_KEY', default='')
