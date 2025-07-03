import { Switch } from 'antd';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

const Config = memo(() => {
  const { t } = useTranslation('components');

  return (
    <Flexbox
      align={'center'}
      gap={8}
      horizontal
    >
      {t('FileManager.config.showFilesInKnowledgeBase')}
      <Switch size={'small'} />
    </Flexbox>
  );
});

export default Config;
