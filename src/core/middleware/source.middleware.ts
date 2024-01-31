import { rlife_base_is_server } from '../../global';
import { EventMetadata } from '../decorators/event';
import { Injectable } from '../decorators/injectable';
import { Middleware, MiddlewareFactory } from './middleware';

@Injectable()
export class SourceMiddlewareFactory implements MiddlewareFactory {
    public create(event: EventMetadata, next: Middleware): Middleware {
        if (rlife_base_is_server) {
            return (...args): void | Promise<any> => {
                if (event.net) {
                    const source = (global as any).source as number;

                    return next(source, ...args);
                }

                return next(...args);
            };
        } else {
            return next;
        }
    }
}
