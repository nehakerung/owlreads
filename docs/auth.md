# Djoser Auth
Djoser is a comprehensive solution for adding authentication features to a Django REST API, offering support for a wide array of functionalities including login, registration, password resets and updates, account activation, and deletion, among others.

Djoser simplifies the process by providing a collection of ready-to-use URLs that can be seamlessly incorporated into the project's URL configurations without the need for additional coding.

`rest_framework_simplejwt.token_blacklist.` The last one is useful as we need to add a logout feature in the application. This application is used to blacklist a refresh token and thus does not allow the client with a refresh token blacklisted to claim a new access token.

Below are the Djoser URLs we'll be utilizing in this guide:

`/users/`: Submitting a POST request to this route creates a new user account on the Django backend, serving as the registration process.

`/users/me/`: A GET request to this endpoint returns information about the currently authenticated user, requiring the user to be logged in.

`/users/reset_password/`: A POST request here initiates a password reset process by sending an email to the provided address with a password reset link, but only if the user account exists.

`/users/reset_password_confirm/`: By making a POST request to this route with the uid, token, and new_password, the user can reset their password to the new value specified in the new_password field.

`/jwt/create/`: This endpoint is used for logging in, where it authenticates the user and returns a JWT for subsequent authenticated requests.

`/jwt/refresh/`: This endpoint is for refreshing an existing access token by providing a valid refresh token, thus granting a new access token.
