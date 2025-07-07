import { ErrorHandler } from '@angular/core';

export class GlobalErrorHandler extends ErrorHandler {
  override handleError(error) {
    console.log('GlobalErrorHandler error')
    throw error;
  }
}