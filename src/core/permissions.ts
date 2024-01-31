import { Injectable } from './decorators/injectable';

export type rLife_Role = 'admin' | 'staff' | 'gamemaster' | 'helper' | 'user';

@Injectable()
export class Permissions {
    addPlayerRole(source: number, role: rLife_Role) {
        ExecuteCommand(`add_principal "player.${source}" "rlife_role.${role}"`);
    }

    allowCommandForRole(command: string, role: rLife_Role) {
        ExecuteCommand(`add_ace "rlife_role.${role}" "command.${command}" allow`);
    }
}
