import { memo } from "react";

import { useChatStore } from "@/store/chat";
import { chatSelectors } from "@/store/chat/selectors";
import { ChatMessage } from "@/types/message";

import { RenderMessageExtra } from "../types";
import ExtraContainer from "./ExtraContainer";
import Translate from "./Translate";

export const UserMessageExtra: RenderMessageExtra = memo<
  ChatMessage & { extra?: any }
>(({ extra, id, content }) => {
  const isTranslating = useChatStore(chatSelectors.isMessageTranslating(id));
  
  return (
    <div style={{ marginTop: 8 }}>
      {(!!extra?.translate || isTranslating) && (
        <ExtraContainer>
          <Translate id={id} {...extra?.translate} loading={isTranslating} />
        </ExtraContainer>
      )}
    </div>
  );
});
