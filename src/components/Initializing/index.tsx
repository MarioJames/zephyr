'use client';

import { useState } from 'react';

import Content from './Content';
import Redirect from './Redirect';
import { AppLoadingStage } from './stage';

const Initializing = () => {
  const [loadingStage, setLoadingStage] = useState(
    AppLoadingStage.Initializing
  );

  return (
    <>
      <Content loadingStage={loadingStage} />
      <Redirect setLoadingStage={setLoadingStage} />
    </>
  );
};

Initializing.displayName = 'Initializing';

export default Initializing;
