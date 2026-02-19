import React, { useState, useRef, DragEvent, ReactNode } from 'react';

export interface GraphProps {
    children?: ReactNode;
    chains?: ReactNode; // Компоненты Chain для отображения связей
    onNodeDrop?: (draggedId: string, position: { x: number; y: number }) => void;
    onNodeMove?: (nodeId: string, position: { x: number; y: number }) => void;
    className?: string;
    style?: React.CSSProperties;

    posManage?: [{ x: number; y : number }, (value: { x: number; y : number }) => void]
}

export function Graph(props: GraphProps) {
    const {
        children,
        chains,
        onNodeDrop,
        onNodeMove,
        className = '',
        style = {},
        posManage,
    } = props;

    const [isDragOver, setIsDragOver] = useState(false);
    const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
    const graphRef = useRef<HTMLDivElement>(null);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsDragOver(true);

        if (graphRef.current) {
            const rect = graphRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setDragPosition({ x, y });
        }
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        // Проверяем, что мы действительно покинули область графа
        if (!graphRef.current?.contains(e.relatedTarget as Node)) {
            setIsDragOver(false);
            setDragPosition(null);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);

        const draggedId = e.dataTransfer.getData('text/plain');
        
        if (graphRef.current && draggedId) {
            const rect = graphRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const position = { x, y };
            if (position.x > posManage[0].x) {
                posManage[1]({ ...posManage[0], x: position.x })
            }
               if (position.y > posManage[0].y) {
                posManage[1]({ ...posManage[0], y: position.y })
            }

            console.log('style', style)

            if (onNodeDrop) {
                onNodeDrop(draggedId, position);
            }
        }

        setDragPosition(null);
    };

    const handleNodeDrag = (nodeId: string, e: DragEvent<HTMLDivElement>) => {
        if (graphRef.current && onNodeMove) {
            const rect = graphRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            onNodeMove(nodeId, { x, y });
        }
    };

    const graphClassName = [
        'graph',
        isDragOver ? 'graph-drag-over' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div
            ref={graphRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={graphClassName}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                minHeight: '400px',
                border: isDragOver ? '2px dashed #007bff' : '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: isDragOver ? '#f0f8ff' : '#fff',
                transition: 'all 0.2s ease',
                ...style
            }}
        >
            {chains}
            {children}
            {isDragOver && dragPosition && (
                <div
                    style={{
                        position: 'absolute',
                        left: dragPosition.x - 10,
                        top: dragPosition.y - 10,
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#007bff',
                        pointerEvents: 'none',
                        opacity: 0.6,
                        zIndex: 1000
                    }}
                />
            )}
        </div>
    );
}
