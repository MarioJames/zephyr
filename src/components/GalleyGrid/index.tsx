import { ReactNode, memo, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Grid from './Grid';
import { MAX_SIZE_DESKTOP } from './style';

interface GalleyGridProps<T = any> {
  items: T[];
  renderItem: (props: T) => ReactNode;
}

const GalleyGrid = memo<GalleyGridProps>(({ items, renderItem: Render }) => {

  const { firstRow, lastRow } = useMemo(() => {
    if (items.length === 4) {
      return {
        firstRow: items.slice(0, 2),
        lastRow: items.slice(2, 4),
      };
    }

    const firstCol = items.length > 4 ? 3 : items.length;

    return {
      firstRow: items.slice(0, firstCol),
      lastRow: items.slice(firstCol, items.length),
    };
  }, [items]);

  const { gap, max } = useMemo(() => {
    let scale = firstRow.length * (firstRow.length / items.length);

    scale = scale < 1 ? 1 : scale;

    return {
      gap: 6,
      max: MAX_SIZE_DESKTOP * scale,
    };
  }, [items]);

  return (
    <Flexbox gap={gap}>
      <Grid col={firstRow.length} gap={gap} max={max}>
        {firstRow.map((i, index) => (
          <Render {...i} index={index} key={index} />
        ))}
      </Grid>
      {lastRow.length > 0 && (
        <Grid col={firstRow.length} gap={gap} max={max}>
          {lastRow.map((i, index) => (
            <Render {...i} index={index} key={index} />
          ))}
        </Grid>
      )}
    </Flexbox>
  );
});

export default GalleyGrid;
