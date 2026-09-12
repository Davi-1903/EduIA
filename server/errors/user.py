class UserServiceError(Exception):
    pass


class UserAlreadyExistsError(UserServiceError):
    pass


class UserTypeError(UserServiceError):
    pass


class UserCredentialsError(UserServiceError):
    pass
