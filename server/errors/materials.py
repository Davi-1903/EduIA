class MaterialServiceError(Exception):
    pass


class MaterialNotFoundError(MaterialServiceError):
    pass


class MaterialValidationError(MaterialServiceError):
    pass
