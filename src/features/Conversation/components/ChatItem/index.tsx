'use client';

import { createStyles } from 'antd-style';
import { ReactNode, memo, useCallback, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import ChatItem from '@/features/ChatItem';
import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { ChatMessage } from '@/types/message';
import { removeSystemContext } from '@/utils/messageContentFilter';

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

        return <RenderFunction displayMode={'chat'} dom={dom} text={text} />;
      },
      [item?.role]
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
      () =>
        item && (
          <MessageExtra
            data={{ ...(item as any), extra: { translate: item.translation } }}
          />
        ),
      [item]
    );

    // 过滤用户消息的系统上下文
    const displayContent = useMemo(() => {
      if (!item?.content) return item?.content;

      // 只对用户消息进行过滤，保留助手消息的完整内容
      if (item.role === 'user') {
        return removeSystemContext(item.content);
      }

      return item.content;
    }, [item?.content, item?.role]);

    return (
      item && (
        <Flexbox className={cx(styles.message, className)}>
          <ChatItem
            actions={actionBar}
            avatar={
              item.role === 'user' ? item.session?.avatar : item.user?.avatar
            }
            error={error}
            errorMessage={errorMessage}
            markdownProps={markdownProps}
            message={displayContent}
            messageExtra={messageExtra}
            name={item.session?.title}
            placement={item.role === 'user' ? 'left' : 'right'}
            primary={item.role === 'assistant'}
            renderMessage={renderMessage}
            time={new Date(item.createdAt!).getTime()}
            variant={'bubble'}
          />
          {endRender}
        </Flexbox>
      )
    );
  }
);

Item.displayName = 'ChatItem';

export default Item;
