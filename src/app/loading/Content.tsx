import React, { memo } from 'react';

import FullscreenLoading from '@/components/Loading/FullscreenLoading';

import { AppLoadingStage, SERVER_LOADING_STAGES } from './stage';

interface ContentProps {
  loadingStage: AppLoadingStage;
}

const Content = memo<ContentProps>(({ loadingStage }) => {
  const activeStage = SERVER_LOADING_STAGES.indexOf(loadingStage);

  const stages = SERVER_LOADING_STAGES.map((key) => key);

  return <FullscreenLoading activeStage={activeStage} stages={stages} />;
});

export default Content;
