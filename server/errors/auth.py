class SuapAuthenticationError(Exception):
    def __init__(self, message: str, code: str = 'failed'):
        super().__init__(message)
        self.code = code
