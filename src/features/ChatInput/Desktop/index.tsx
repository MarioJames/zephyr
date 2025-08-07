'use client';

import { DraggablePanel, DraggablePanelContainer } from '@lobehub/ui';
import { ReactNode, memo, useCallback, useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import { createStyles } from 'antd-style';

import { CHAT_TEXTAREA_HEIGHT, CHAT_TEXTAREA_MAX_HEIGHT } from '@/const/layoutTokens';

import { ActionKeys } from '../ActionBar/config';
import Head from './Header';

export type FooterRender = (params: {
  expand: boolean;
  onExpandChange: (expand: boolean) => void;
}) => ReactNode;

interface DesktopChatInputProps {
  inputHeight: number;
  leftActions: ActionKeys[];
  onInputHeightChange?: (height: number) => void;
  renderFooter: FooterRender;
  renderTextArea: (onSend: () => void) => ReactNode;
  rightActions: ActionKeys[];
}

const useStyles = createStyles(({ css, token }) => ({
  content: css`
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `,
  panel: css`
    z-index: 10;
    background: ${token.colorBgContainer};
  `,
  fullscreenPanel: css`
    z-index: 5;
    background: ${token.colorBgContainer};
  `,
  fullscreenContainer: css`
    padding-top: 56px; /* 对话区header的高度 */
    height: 100vh;
    box-sizing: border-box;
  `,
}));

const DesktopChatInput = memo<DesktopChatInputProps>(
  ({
    leftActions,
    rightActions,
    renderTextArea,
    inputHeight,
    onInputHeightChange,
    renderFooter,
  }) => {
    const { styles } = useStyles();
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    
    const onSend = useCallback(() => {
      setIsFullscreen(false);
    }, []);

    // 处理展开/收起切换
    const handleExpandToggle = useCallback(() => {
      if (isFullscreen) {
        // 如果当前是全屏，点击收起按钮应该回到正常状态
        setIsFullscreen(false);
      } else {
        // 如果当前是正常状态，点击展开按钮应该进入全屏
        setIsFullscreen(true);
      }
    }, [isFullscreen]);

    return (
      <DraggablePanel
          className={isFullscreen ? styles.fullscreenPanel : styles.panel}
          classNames={{
            content: styles.content,
          }}
          expand={!isCollapsed} // 根据收起状态决定面板是否展开
          fullscreen={isFullscreen}
          maxHeight={CHAT_TEXTAREA_MAX_HEIGHT}
          minHeight={CHAT_TEXTAREA_HEIGHT}
          onExpandChange={(expand) => {
            // DraggablePanel自身的展开/收起逻辑
            setIsCollapsed(!expand);
          }}
          onSizeChange={(_, size) => {
            if (!size) return;
            const height =
              typeof size.height === 'string' ? Number.parseInt(size.height) : size.height;
            if (!height) return;
            onInputHeightChange?.(height);
          }}
          placement="bottom"
          showHandleWideArea
          size={{ height: inputHeight, width: '100%' }}
        >
          <DraggablePanelContainer
            className={isFullscreen ? styles.fullscreenContainer : undefined}
            style={{
              flex: 'none',
              height: '100%',
              maxHeight: '100vh',
              width: '100%',
            }}
          >
            <Flexbox
              gap={8}
              height={'100%'}
              paddingBlock={'4px 16px'}
              style={{ minHeight: CHAT_TEXTAREA_HEIGHT, position: 'relative' }}
            >
              <Head
                expand={isFullscreen}
                leftActions={leftActions}
                rightActions={rightActions}
                setExpand={handleExpandToggle}
              />
              <Flexbox gap={8} horizontal style={{ flex: 1 }}>
                <Flexbox style={{ flex: 1 }}>
                  {renderTextArea(onSend)}
                </Flexbox>
                <Flexbox style={{ flex: 'none', alignSelf: 'end' }}>
                  {renderFooter({ expand: isFullscreen, onExpandChange: setIsFullscreen })}
                </Flexbox>
              </Flexbox>
            </Flexbox>
          </DraggablePanelContainer>
        </DraggablePanel>
    );
  },
);

DesktopChatInput.displayName = 'DesktopChatInput';

export default DesktopChatInput;
