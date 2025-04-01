import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { cyan, yellow } from '../utils/colour-logger';

@Injectable()
export class AccessLogMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger(AccessLogMiddleware.name);
  
  public use(request: Request, _response: Response, next: NextFunction): void {
    this.logger.log(yellow(`[${request.method}]`) + ' ' + cyan(`[${request.baseUrl}]`) + this.stringifyParam('Query', request.query) + this.stringifyParam('Body', request.body));
    next();
  }
  
  private stringifyParam(name: string, param: any): string {
    try {
      const parsedParam = param != null ? JSON.stringify(param) : '';
      return ['', '{}'].includes(parsedParam) ? '' : ` ${name}:${parsedParam}`;
    }
    catch(_error) {  // eslint-disable-line @typescript-eslint/no-unused-vars
      return '';
    }
  }
}
