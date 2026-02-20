import React, { useState, useRef, DragEvent } from 'react';
import { useDispatch } from 'react-redux';

import { MarkdownTools } from '../MarkdownTools';
import Button from '../Button';
import store, { setIsScroll } from '../../store';

export interface NodeProps {
    id?: string;
    children?: React.ReactNode;
    content?: string;
    docId?: string[];
    onDrop?: (draggedId: string, targetId: string) => void;
    draggable?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export function Node(props: NodeProps) {
    const {
        id,
        children,
        content,
        docId,
        onDrop,
        draggable = true,
        className = '',
        style = {}
    } = props;
    const [text, setText] = useState(content);

    const [isDragging, setIsDragging] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isHover, setHover] = useState(false);

    const { nodes: { isScroll } } = store.getState();

    const dispatch = useDispatch();

    const nodeRef = useRef<HTMLDivElement>(null);

    const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
        if (!draggable) return;
        
        setIsDragging(true);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', id || '');
        
        // Добавляем визуальную обратную связь
        if (e.dataTransfer) {
            e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
        }
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        if (!draggable) return;
        
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const draggedId = e.dataTransfer.getData('text/plain');
        const targetId = id || '';
        
        if (draggedId && targetId && draggedId !== targetId && onDrop) {
            onDrop(draggedId, targetId);
        }
    };

    const nodeClassName = [
        'node',
        isDragging ? 'node-dragging' : '',
        isDragOver ? 'node-drag-over' : '',
        className
    ].filter(Boolean).join(' ');
    

    return (
        <div
            ref={nodeRef}
            id={id}
            draggable={draggable}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onMouseOver={() => {
                setHover(true);
            }}
            onMouseLeave={() => {
                setHover(false);
            }}
            className={nodeClassName}
            style={{
                cursor: draggable ? 'move' : 'default',
                opacity: isDragging ? 0.5 : 1,
                border:  `2px solid ${isHover ? '#000' : 'transparent'}`, 
                width: 600,
                overflow: isScroll ? 'scroll' : 'inherit',
                ...(isScroll ?  { height: '100vh' } : {}),
                ...style,
                ...(isScroll ? { top:  '0px' } : {}),
            }}
        >
            <Button onClick={() => setIsEdit(!isEdit)}>Редактировать</Button>
            <Button onClick={() => dispatch(setIsScroll(!isScroll))}>Прокрутка {`${isScroll ? 'Вкл.' : 'Выкл.'}`} </Button>
                {!isEdit ? <MarkdownTools.MarkdownFragment 
                    docId={docId || [id]}
                    content={text}
                /> : <MarkdownTools.MarkdownEditor text={text} setText={setText} />}
            {children}
        </div>
    );
}
