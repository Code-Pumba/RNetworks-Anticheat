import 'reflect-metadata'

import { Application } from './core/application'
import { setService, setServiceInstance, unloadContainer } from './core/container'
import { ProviderServerLoader } from './core/loader/provider.server.loader';
import { ChainMiddlewareEventServerFactory } from './core/middleware/middleware.event.server';
import { ChainMiddlewareTickServerFactory } from './core/middleware/middleware.tick.server';
import { store } from './server/Store/store';
import { StoreModule } from './client/store/store.module';


// Module
import { DatabaseModule } from './server/Database/database.module';
import { EventModule } from './server/Events/event.module';
import { ConfigModule } from './server/Config/config.module';
import { SystemModule } from './server/System/System.module';
import { PlayerModule } from './server/Player/player.module';

async function bootstrap() {
    setServiceInstance('Store', store);
    setService('MiddlewareFactory', ChainMiddlewareEventServerFactory);
    setService('MiddlewareTickFactory', ChainMiddlewareTickServerFactory);

    const app = await Application.create(
        ProviderServerLoader,
        StoreModule,
        DatabaseModule,
        ConfigModule,
        EventModule,
        SystemModule,
        PlayerModule
    )

    await app.stop()

    unloadContainer();
}

bootstrap()