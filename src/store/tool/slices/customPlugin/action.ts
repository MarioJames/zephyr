import { LobeChatPluginManifest } from '@lobehub/chat-plugin-sdk';
import { merge } from 'lodash-es';
import { StateCreator } from 'zustand/vanilla';

import { notification } from '@/components/AntdStaticMethods';
import { pluginApi } from '@/app/api/plugin';
import { toolApi } from '@/app/api/tool';
import { pluginHelpers } from '@/store/tool/helpers';
import { LobeToolCustomPlugin, PluginInstallError } from '@/types/tool/plugin';
import { setNamespace } from '@/utils/storeDebug';

import { ToolStore } from '../../store';
import { pluginSelectors } from '../plugin/selectors';
import { defaultCustomPlugin } from './initialState';

const n = setNamespace('customPlugin');

export interface CustomPluginAction {
  installCustomPlugin: (value: LobeToolCustomPlugin) => Promise<void>;
  reinstallCustomPlugin: (id: string) => Promise<void>;
  uninstallCustomPlugin: (id: string) => Promise<void>;
  updateCustomPlugin: (id: string, value: LobeToolCustomPlugin) => Promise<void>;
  updateNewCustomPlugin: (value: Partial<LobeToolCustomPlugin>) => void;
}

export const createCustomPluginSlice: StateCreator<
  ToolStore,
  [['zustand/devtools', never]],
  [],
  CustomPluginAction
> = (set, get) => ({
  installCustomPlugin: async (value) => {
    await pluginApi.createCustomPlugin(value);

    await get().refreshPlugins();
    set({ newCustomPlugin: defaultCustomPlugin }, false, n('saveToCustomPluginList'));
  },
  reinstallCustomPlugin: async (id) => {
    const plugin = pluginSelectors.getCustomPluginById(id)(get());
    if (!plugin) return;

    const { refreshPlugins, updateInstallLoadingState } = get();

    try {
      updateInstallLoadingState(id, true);
      let manifest: LobeChatPluginManifest;
        manifest = await toolApi.getToolManifest(
          plugin.customParams?.manifestUrl,
          plugin.customParams?.useProxy,
        );
      updateInstallLoadingState(id, false);

      await pluginApi.updatePluginManifest(id, manifest);
      await refreshPlugins();
    } catch (error) {
      updateInstallLoadingState(id, false);

      console.error(error);
      const err = error as PluginInstallError;

      const meta = pluginSelectors.getPluginMetaById(id)(get());
      const name = pluginHelpers.getPluginTitle(meta);

      notification.error({
        description: `插件错误：${err.message}`,
        message: `插件重装失败：${name}`,
      });
    }
  },
  uninstallCustomPlugin: async (id) => {
    await pluginApi.uninstallPlugin(id);
    await get().refreshPlugins();
  },

  updateCustomPlugin: async (id, value) => {
    const { reinstallCustomPlugin } = get();
    // 1. 更新 list 项信息
    await pluginApi.updatePlugin(id, value);

    // 2. 重新安装插件
    await reinstallCustomPlugin(id);
  },
  updateNewCustomPlugin: (newCustomPlugin) => {
    set(
      { newCustomPlugin: merge({}, get().newCustomPlugin, newCustomPlugin) },
      false,
      n('updateNewDevPlugin'),
    );
  },
});
