import { rLife_Role } from '../permissions';
import { setMethodMetadata } from './reflect';

export type CommandMetadata = {
    name: string;
    description: string;
    role: rLife_Role[] | rLife_Role | null;
    keys: CommandKey[];
    passthroughNuiFocus: boolean;
};

export type CommandKey = {
    mapper: 'keyboard' | 'mouse';
    key: string;
};

export const CommandMetadataKey = 'rlife_core.decorator.command';

export const Command = (name: string, options: Partial<Omit<CommandMetadata, 'name'>> = {}): MethodDecorator => {
    return (target, propertyKey) => {
        setMethodMetadata(
            CommandMetadataKey,
            {
                name,
                description: options.description || null,
                role: options.role || null,
                keys: options.keys || [],
                passthroughNuiFocus: options.passthroughNuiFocus || false,
            },
            target,
            propertyKey
        );
    };
};
