import 'reflect-metadata'

import './global'
import { Application } from './core/application';
import { setService, setServiceInstance, unloadContainer } from './core/container';
import { ProviderClientLoader } from './core/loader/provider.client.loader';
import { ChainMiddlewareEventClientFactory } from './core/middleware/middleware.event.client';
import { ChainMiddlewareTickClientFactory } from './core/middleware/middleware.tick.client';
import { store } from './client/store/store';

import { ApplicationModule } from './client/Application/application.module';

async function bootstrap() {
    setServiceInstance('Store', store);
    setService('MiddlewareFactory', ChainMiddlewareEventClientFactory);
    setService('MiddlewareTickFactory', ChainMiddlewareTickClientFactory);

    const app = await Application.create(
        ProviderClientLoader,
        ApplicationModule
    )

    await app.stop()
    unloadContainer()
}

bootstrap()