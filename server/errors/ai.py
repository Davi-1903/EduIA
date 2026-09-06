class AiServiceError(Exception):
    pass


class AiProviderUnavailable(AiServiceError):
    pass


class AiTimeout(AiServiceError):
    pass


class AiInvalidResponse(AiServiceError):
    pass


class AiInvalidRequest(AiServiceError):
    pass


class AiConfigurationError(AiServiceError):
    pass


class AiInvalidData(AiServiceError):
    pass


class AiGenerationNotStarted(AiServiceError):
    pass
