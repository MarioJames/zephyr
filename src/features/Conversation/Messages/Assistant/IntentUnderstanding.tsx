import { createStyles } from 'antd-style';
import { Flexbox } from 'react-layout-kit';

import CircleLoader from '@/components/CircleLoader';
import { shinyTextStylish } from '@/styles/loading';

const useStyles = createStyles(({ token }) => ({
  shinyText: shinyTextStylish(token),
}));

const IntentUnderstanding = () => {
  const { styles } = useStyles();

  return (
    <Flexbox align={'center'} gap={8} horizontal>
      <CircleLoader />
      <Flexbox className={styles.shinyText} horizontal>
        {'正在理解并分析您的意图...'}
      </Flexbox>
    </Flexbox>
  );
};
export default IntentUnderstanding;
