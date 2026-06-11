import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { McpService } from '../../api/api/mcp.service';
import type { CreateMcpServerCommand } from '../../api/model/createMcpServerCommand';
import type { McpServerDto } from '../../api/model/mcpServerDto';
import type { UpdateMcpServerCommand } from '../../api/model/updateMcpServerCommand';

type McpStoreState = {
  servers: McpServerDto[];
  loaded: boolean;
};

export const initialMcpStore: McpStoreState = {
  servers: [],
  loaded: false,
};

export const McpStore = signalStore(
  { providedIn: 'root' },
  withState(initialMcpStore),
  withComputed(() => ({})),
  withMethods((store) => {
    const mcpApi = inject(McpService);

    async function load(force = false): Promise<void> {
      if (store.loaded() && !force)
        return;
      const servers = await firstValueFrom(mcpApi.apiMcpServersGet());
      patchState(store, { servers, loaded: true });
    }

    // The server decides ordering and the canManage/isGlobal flags, so the list is
    // refetched after every mutation instead of being patched locally.
    async function create(command: CreateMcpServerCommand): Promise<void> {
      await firstValueFrom(mcpApi.apiMcpServersPost(command));
      await load(true);
    }

    async function update(id: string, command: UpdateMcpServerCommand): Promise<void> {
      await firstValueFrom(mcpApi.apiMcpServersIdPut(id, command));
      await load(true);
    }

    async function remove(id: string): Promise<void> {
      await firstValueFrom(mcpApi.apiMcpServersIdDelete(id));
      await load(true);
    }

    return { load, create, update, remove };
  }),
  withHooks(() => ({})),
);
