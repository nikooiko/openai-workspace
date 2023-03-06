import { applyDecorators } from '@nestjs/common';
import { ApiResponseOptions, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AppForbiddenException } from '../exceptions/app-forbidden.exception';

export function ApiAppForbiddenResponse(options?: ApiResponseOptions) {
  return applyDecorators(
    ApiUnauthorizedResponse({
      type: AppForbiddenException,
      description: AppForbiddenException.DESC_DEFAULT,
      ...options,
    }),
  );
}
