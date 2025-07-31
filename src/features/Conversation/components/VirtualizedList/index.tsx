'use client';

import { Icon } from '@lobehub/ui';
import { useTheme } from 'antd-style';
import { Loader2Icon } from 'lucide-react';
import React, {
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Center, Flexbox } from 'react-layout-kit';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';

import AutoScroll from '../AutoScroll';
import { VirtuosoContext } from './VirtuosoContext';

interface VirtualizedListProps {
  dataSource: string[];
  itemContent: (index: number, data: any, context: any) => ReactNode;
}

const VirtualizedList = memo<VirtualizedListProps>(
  ({ dataSource, itemContent }) => {
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const [atBottom, setAtBottom] = useState(true);
    const [isScrolling, setIsScrolling] = useState(false);

    const [activeTopicId, isCurrentChatLoaded] = useChatStore((s) => [
      chatSelectors.activeTopicId(s),
      chatSelectors.isCurrentChatLoaded(s),
    ]);

    useEffect(() => {
      if (virtuosoRef.current) {
        virtuosoRef.current.scrollToIndex({
          align: 'end',
          behavior: 'auto',
          index: 'LAST',
        });
      }
    }, [activeTopicId]);

    const prevDataLengthRef = useRef(dataSource.length);

    const getFollowOutput = useCallback(() => {
      const newFollowOutput =
        dataSource.length > prevDataLengthRef.current ? 'auto' : false;
      prevDataLengthRef.current = dataSource.length;
      return newFollowOutput;
    }, [dataSource.length]);

    const theme = useTheme();

    // overscan should be 3 times the height of the window
    const overscan = typeof window !== 'undefined' ? window.innerHeight * 3 : 0;

    if (!isCurrentChatLoaded)
      // in client mode and switch page, using the center loading for smooth transition
      return (
        <Center height={'100%'} width={'100%'}>
          <Icon
            icon={Loader2Icon}
            size={32}
            spin
            style={{ color: theme.colorTextTertiary }}
          />
        </Center>
      );

    return (
      <VirtuosoContext value={virtuosoRef}>
        <Flexbox height={'100%'}>
          <Virtuoso
            atBottomStateChange={setAtBottom}
            atBottomThreshold={50}
            computeItemKey={(_, item) => item}
            data={dataSource}
            followOutput={getFollowOutput}
            increaseViewportBy={overscan}
            initialTopMostItemIndex={dataSource?.length - 1}
            isScrolling={setIsScrolling}
            itemContent={itemContent}
            overscan={overscan}
            ref={virtuosoRef}
          />
          <AutoScroll
            atBottom={atBottom}
            isScrolling={isScrolling}
            onScrollToBottom={(type) => {
              const virtuoso = virtuosoRef.current;
              switch (type) {
                case 'auto': {
                  virtuoso?.scrollToIndex({
                    align: 'end',
                    behavior: 'auto',
                    index: 'LAST',
                  });
                  break;
                }
                case 'click': {
                  virtuoso?.scrollToIndex({
                    align: 'end',
                    behavior: 'smooth',
                    index: 'LAST',
                  });
                  break;
                }
              }
            }}
          />
        </Flexbox>
      </VirtuosoContext>
    );
  }
);

export default VirtualizedList;
