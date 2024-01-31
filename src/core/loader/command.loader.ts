import { rlife_base_is_client } from '../../global';
import { CommandMetadata, CommandMetadataKey } from '../decorators/command';
import { Inject, Injectable } from '../decorators/injectable';
import { getMethodMetadata } from '../decorators/reflect';
import { Permissions } from '../permissions';

@Injectable()
export class CommandLoader {
    private commands: CommandMetadata[] = [];

    @Inject(Permissions)
    private permissions: Permissions;

    public load(provider): void {
        const commandMethodList = getMethodMetadata<CommandMetadata>(CommandMetadataKey, provider);

        for (const methodName of Object.keys(commandMethodList)) {
            const commandMetadata = commandMethodList[methodName];
            const method = provider[methodName].bind(provider);
            const commandMethod = (source: number, args: string[]): void => {
                if (rlife_base_is_client) {
                    if (
                        commandMetadata.keys &&
                        commandMetadata.keys.length > 0 &&
                        !commandMetadata.passthroughNuiFocus &&
                        IsNuiFocused()
                    ) {
                        return;
                    }
                }

                method(source, ...args);
            };

            if (rlife_base_is_client) {
                if (commandMetadata.keys) {
                    for (const key of commandMetadata.keys) {
                        RegisterKeyMapping(
                            commandMetadata.name,
                            commandMetadata.description || '',
                            key.mapper,
                            key.key
                        );
                    }
                }
            }

            RegisterCommand(commandMetadata.name, commandMethod, commandMetadata.role !== null);
            this.commands.push(commandMetadata);

            if (commandMetadata.role !== null) {
                if (Array.isArray(commandMetadata.role)) {
                    for (const role of commandMetadata.role) {
                        this.permissions.allowCommandForRole(commandMetadata.name, role);
                    }
                } else {
                    this.permissions.allowCommandForRole(commandMetadata.name, commandMetadata.role);
                }
            }
        }
    }

    public unload(): void {
        this.commands = [];
    }
}
