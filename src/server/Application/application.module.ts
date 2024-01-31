import { Module } from '@public/core/decorators/module'
import { ApplicationProvider } from './application.provider'
import { ApplicationBanProvider } from './application.ban.provider'
@Module({
    providers: [ApplicationProvider, ApplicationBanProvider],
})

export class ApplicationModule { }