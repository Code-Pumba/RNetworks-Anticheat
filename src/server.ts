import 'reflect-metadata'

import { Application } from './core/application'
import { setService, setServiceInstance, unloadContainer } from './core/container'
import { ProviderServerLoader } from './core/loader/provider.server.loader';
import { ChainMiddlewareEventServerFactory } from './core/middleware/middleware.event.server';
import { ChainMiddlewareTickServerFactory } from './core/middleware/middleware.tick.server';
import { store } from './server/Store/store';
import { StoreModule } from './client/store/store.module';


// Module
import { ApplicationModule } from './server/Application/application.module'
import { DatabaseModule } from './server/Database/database.module';
import { EventProtectionModule } from './server/EventProtections/eventProtection.module';
import { ConfigModule } from './server/Config/config.module';
import { PlayerModule } from './server/Player/player.module';

async function bootstrap() {
    setServiceInstance('Store', store);
    setService('MiddlewareFactory', ChainMiddlewareEventServerFactory);
    setService('MiddlewareTickFactory', ChainMiddlewareTickServerFactory);

    const app = await Application.create(
        ProviderServerLoader,
        StoreModule,
        DatabaseModule,
        ApplicationModule,
        ConfigModule,
        EventProtectionModule,
        PlayerModule
    )

    await app.stop()

    unloadContainer();
}

bootstrap()