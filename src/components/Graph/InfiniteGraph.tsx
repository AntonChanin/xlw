import { useState, useCallback } from 'react';

import { Graph, GraphProps } from './Graph';
import store from '../../store';

export function InfiniteGraph(props: GraphProps) {
    const [pos, setPos] = useState({ x: 1000, y: 1000 });
    const { nodes: { isScroll } } = store.getState();
 
    const caclCoord = useCallback((v: 'x' | 'y') => {
        if (isScroll) {
            return 'calc(100vh - 60px)';
        }

        return `calc(${pos[v]}px * 2 + 100v${{ 
            x: 'w',
            y: 'h'
        }[v]})`;
    }, [JSON.stringify(pos)]);

    return (
        <div style={{ width: '100vw', ...({ height: `100${isScroll ? '%' : 'vh'}` }), overflow: 'scroll', ...({ overflowY: 'initial' })  }}>
            <Graph posManage={[pos, setPos]} {...props} style={{ ...props.style, minWidth: '100vw', minHeight: '100vh', width: caclCoord('x'), height: caclCoord('y')}} />
        </div>
    );
}
