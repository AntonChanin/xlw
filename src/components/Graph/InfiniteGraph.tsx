import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';

import { Graph, GraphProps } from './Graph';

export function InfiniteGraph(props: GraphProps) {
    const [pos, setPos] = useState({ x: 1000, y: 1000 });

    const caclCoord = useCallback((v: 'x' | 'y') => {
        console.log(`calc(${pos[v]}px * 2 + '100vw)`, pos)
        return `calc(${pos[v]}px * 2 + 100v${{ 
            x: 'w',
            y: 'h'
        }[v]})`;
    }, [JSON.stringify(pos)])

    return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'scroll' }}>
            <Graph posManage={[pos, setPos]} {...props} style={{ ...props.style, minWidth: '100vw', minHeight: '100vh', width: caclCoord('x'), height: caclCoord('y')}} />
        </div>
        
    );
}
