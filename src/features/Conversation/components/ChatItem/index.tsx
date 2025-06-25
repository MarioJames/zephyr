'use client';

import { createStyles } from 'antd-style';
import { ReactNode, memo, useCallback, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import ChatItem from '@/features/ChatItem';
import { useAgentStore } from '@/store/agent';
import { agentChatConfigSelectors } from '@/store/agent/selectors';
import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { ChatMessage } from '@/types/message';

import ErrorMessageExtra, { useErrorContent } from '../../Error';
import { renderMessagesExtra } from '../../Extras';
import { markdownCustomRenders, renderMessages } from '../../Messages';
import { markdownElements } from '../MarkdownElements';

const rehypePlugins = markdownElements
  .map((element) => element.rehypePlugin)
  .filter(Boolean);
const remarkPlugins = markdownElements
  .map((element) => element.remarkPlugin)
  .filter(Boolean);

const useStyles = createStyles(({ css, prefixCls }) => ({
  loading: css`
    opacity: 0.6;
  `,
  message: css`
    position: relative;
    // prevent the textarea too long
    .${prefixCls}-input {
      max-height: 900px;
    }
  `,
}));

export interface ChatListItemProps {
  actionBar?: ReactNode;
  className?: string;
  endRender?: ReactNode;
  id: string;
}

const Item = memo<ChatListItemProps>(
  ({ className, id, actionBar, endRender }) => {
    const { styles, cx } = useStyles();

    const type = useAgentStore(agentChatConfigSelectors.displayMode);
    const item = useChatStore(chatSelectors.getMessageById(id));

    const renderMessage = useCallback(
      (editableContent: ReactNode) => {
        if (!item?.role) return;
        const RenderFunction =
          renderMessages[item.role] ?? renderMessages['default'];

        if (!RenderFunction) return;

        return <RenderFunction {...item} editableContent={editableContent} />;
      },
      [item]
    );

    const MessageExtra = useCallback(
      ({ data }: { data: ChatMessage }) => {
        if (!item?.role) return;
        let RenderFunction;
        if (renderMessagesExtra?.[item.role])
          RenderFunction = renderMessagesExtra[item.role];

        if (!RenderFunction) return;
        return <RenderFunction {...data} />;
      },
      [item?.role]
    );

    const markdownCustomRender = useCallback(
      (dom: ReactNode, { text }: { text: string }) => {
        if (!item?.role) return dom;
        let RenderFunction;

        if (renderMessagesExtra?.[item.role])
          RenderFunction = markdownCustomRenders[item.role];
        if (!RenderFunction) return dom;

        return (
          <RenderFunction displayMode={type} dom={dom} id={id} text={text} />
        );
      },
      [item?.role, type]
    );

    const error = useErrorContent(item?.error);

    // ======================= Performance Optimization ======================= //
    // these useMemo/useCallback are all for the performance optimization
    // maybe we can remove it in React 19
    // ======================================================================== //

    const components = useMemo(
      () =>
        Object.fromEntries(
          markdownElements.map((element) => {
            const Component = element.Component;

            return [
              element.tag,
              (props: any) => <Component {...props} id={id} />,
            ];
          })
        ),
      [id]
    );

    const markdownProps = useMemo(
      () => ({
        animated: false,
        citations: item?.role === 'user' ? undefined : item?.search?.citations,
        components,
        customRender: markdownCustomRender,
        enableCustomFootnotes: item?.role === 'assistant',
        rehypePlugins: item?.role === 'user' ? undefined : rehypePlugins,
        remarkPlugins: item?.role === 'user' ? undefined : remarkPlugins,
      }),
      [components, markdownCustomRender, item?.role, item?.search]
    );

    const errorMessage = useMemo(
      () => item && <ErrorMessageExtra data={item} />,
      [item]
    );
    const messageExtra = useMemo(
      () => item && <MessageExtra data={item} />,
      [item]
    );

    return (
      item && (
        <Flexbox className={cx(styles.message, className)}>
          <ChatItem
            actions={actionBar}
            avatar={item.metadata?.avatar}
            error={error}
            errorMessage={errorMessage}
            markdownProps={markdownProps}
            message={item.content}
            messageExtra={messageExtra}
            placement={
              type === 'chat'
                ? item.role === 'user'
                  ? 'right'
                  : 'left'
                : 'left'
            }
            primary={item.role === 'user'}
            renderMessage={renderMessage}
            time={new Date(item.createdAt!).getTime()}
            variant={type === 'chat' ? 'bubble' : 'docs'}
          />
          {endRender}
        </Flexbox>
      )
    );
  }
);

Item.displayName = 'ChatItem';

export default Item;
