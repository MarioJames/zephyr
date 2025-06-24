/* eslint-disable sort-keys-fix/sort-keys-fix, typescript-sort-keys/interface */
import isEqual from "fast-deep-equal";
import { SWRResponse, mutate } from "swr";
import { StateCreator } from "zustand/vanilla";

import { chainSummaryTitle } from "@/chains/summaryTitle";
import { LOADING_FLAT } from "@/const/message";
import { TraceNameMap } from "@/const/trace";
import { useClientDataSWR } from "@/libs/swr";
import { chatApi } from "@/app/api";
import { messageApi } from "@/app/api";
import { topicsAPI } from "@/services";
import type { ChatStore } from "@/store/chat";
import { useUserStore } from "@/store/user";
import { systemAgentSelectors } from "@/store/user/selectors";
import { ChatMessage } from "@/types/message";
import { ChatTopic } from "@/types/topic";
import { merge } from "@/utils/merge";

import { chatSelectors } from "../message/selectors";
import { ChatTopicDispatch, topicReducer } from "./reducer";
import { topicSelectors } from "./selectors";

const SWR_USE_FETCH_TOPIC = "SWR_USE_FETCH_TOPIC";

export interface ChatTopicAction {
  refreshTopic: () => Promise<void>;
  removeTopic: (id: string) => Promise<void>;
  createTopic: () => Promise<string | undefined>;

  summaryTopicTitle: (
    topicId: string,
    messages: ChatMessage[]
  ) => Promise<void>;
  switchTopic: (id?: string, skipRefreshMessage?: boolean) => Promise<void>;
  updateTopicTitle: (id: string, title: string) => Promise<void>;
  useFetchTopics: (
    enable: boolean,
    sessionId: string
  ) => SWRResponse<ChatTopic[]>;

  internal_updateTopicTitleInSummary: (id: string, title: string) => void;
  internal_updateTopicLoading: (id: string, loading: boolean) => void;
  internal_createTopic: (params: CreateTopicParams) => Promise<string>;
  internal_updateTopic: (id: string, data: Partial<ChatTopic>) => Promise<void>;
  internal_dispatchTopic: (payload: ChatTopicDispatch, action?: any) => void;
}

export const chatTopic: StateCreator<
  ChatStore,
  [["zustand/devtools", never]],
  [],
  ChatTopicAction
> = (set, get) => ({
  createTopic: async () => {
    const { activeId, internal_createTopic } = get();

    const messages = chatSelectors.activeBaseChats(get());

    set({ creatingTopic: true }, false);
    const topicId = await internal_createTopic({
      sessionId: activeId,
      title: "新对话主题",
      messages: messages.map((m) => m.id),
    });
    set({ creatingTopic: false }, false);

    return topicId;
  },
  // update
  summaryTopicTitle: async (topicId, messages) => {
    const { internal_updateTopicTitleInSummary, internal_updateTopicLoading } =
      get();
    const topic = topicSelectors.getTopicById(topicId)(get());
    if (!topic) return;

    internal_updateTopicTitleInSummary(topicId, LOADING_FLAT);

    let output = "";

    // Get current agent for topic
    const topicConfig = systemAgentSelectors.topic(useUserStore.getState());

    // Automatically summarize the topic title
    await chatApi.fetchPresetTaskResult({
      onError: () => {
        internal_updateTopicTitleInSummary(topicId, topic.title);
      },
      onFinish: async (text) => {
        await get().internal_updateTopic(topicId, { title: text });
      },
      onLoadingChange: (loading) => {
        internal_updateTopicLoading(topicId, loading);
      },
      onMessageHandle: (chunk) => {
        switch (chunk.type) {
          case "text": {
            output += chunk.text;
          }
        }

        internal_updateTopicTitleInSummary(topicId, output);
      },
      params: merge(topicConfig, chainSummaryTitle(messages)),
      trace: get().getCurrentTracePayload({
        traceName: TraceNameMap.SummaryTopicTitle,
        topicId,
      }),
    });
  },

  updateTopicTitle: async (id, title) => {
    await get().internal_updateTopic(id, { title });
  },
  // query
  useFetchTopics: (enable, sessionId) =>
    useClientDataSWR<ChatTopic[]>(
      enable ? [SWR_USE_FETCH_TOPIC, sessionId] : null,
      async ([, sessionId]: [string, string]) =>
        topicsAPI.getTopicList(sessionId),
      {
        suspense: true,
        fallbackData: [],
        onSuccess: (topics) => {
          const nextMap = { ...get().topicMaps, [sessionId]: topics };

          // no need to update map if the topics have been init and the map is the same
          if (get().topicsInit && isEqual(nextMap, get().topicMaps)) return;

          set({ topicMaps: nextMap, topicsInit: true }, false);
        },
      }
    ),
  switchTopic: async (id, skipRefreshMessage) => {
    set({ activeTopicId: !id ? (null as any) : id }, false);

    if (skipRefreshMessage) return;
    await get().refreshMessages();
  },
  removeTopic: async (id) => {
    const { activeId, activeTopicId, switchTopic, refreshTopic } = get();

    // remove messages in the topic
    // TODO: Need to remove because server service don't need to call it
    await messageApi.removeMessagesByAssistant(activeId, id);

    // remove topic
    await topicsAPI.deleteTopic(id);
    await refreshTopic();

    // switch bach to default topic
    if (activeTopicId === id) switchTopic();
  },

  // Internal process method of the topics
  internal_updateTopicTitleInSummary: (id, title) => {
    get().internal_dispatchTopic(
      { type: "updateTopic", id, value: { title } },
      "updateTopicTitleInSummary"
    );
  },
  refreshTopic: async () => {
    return mutate([SWR_USE_FETCH_TOPIC, get().activeId]);
  },

  internal_updateTopicLoading: (id, loading) => {
    set((state) => {
      if (loading) return { topicLoadingIds: [...state.topicLoadingIds, id] };

      return { topicLoadingIds: state.topicLoadingIds.filter((i) => i !== id) };
    }, false);
  },

  internal_updateTopic: async (id, data) => {
    get().internal_dispatchTopic({ type: "updateTopic", id, value: data });

    get().internal_updateTopicLoading(id, true);
    await topicsAPI.updateTopic(id, data);
    await get().refreshTopic();
    get().internal_updateTopicLoading(id, false);
  },
  internal_createTopic: async (params) => {
    const tmpId = Date.now().toString();
    get().internal_dispatchTopic(
      { type: "addTopic", value: { ...params, id: tmpId } },
      "internal_createTopic"
    );

    get().internal_updateTopicLoading(tmpId, true);
    const topicInfo = await topicsAPI.createTopic(params);
    get().internal_updateTopicLoading(tmpId, false);

    get().internal_updateTopicLoading(topicInfo.id, true);
    await get().refreshTopic();
    get().internal_updateTopicLoading(topicInfo.id, false);

    return topicInfo.id;
  },

  internal_dispatchTopic: (payload, action) => {
    const nextTopics = topicReducer(
      topicSelectors.currentTopics(get()),
      payload
    );
    const nextMap = { ...get().topicMaps, [get().activeId]: nextTopics };

    // no need to update map if is the same
    if (isEqual(nextMap, get().topicMaps)) return;

    set({ topicMaps: nextMap }, false);
  },
});
