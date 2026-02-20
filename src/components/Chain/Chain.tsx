import React, { useEffect, useState, useRef } from 'react';

import store from '../../store';

export type ChainId = string;

export interface ChainEndpoint {
    /**
     * Идентификатор узла (nodeId) для визуального отображения связи.
     */
    nodeId?: string;
    /**
     * Идентификатор документа (пример: имя файла, UUID и т.п.).
     */
    docId?: string;
    /**
     * Идентификатор фрагмента внутри документа (пример: anchor, heading id).
     */
    fragmentId?: string;
}

export interface ChainProps {
    /**
     * Уникальный идентификатор конкретной связи.
     */
    id: ChainId;
    /**
     * Точка, из которой идёт ссылка.
     */
    from: ChainEndpoint;
    /**
     * Точка, на которую указывает ссылка.
     */
    to: ChainEndpoint;
    /**
     * Цвет линии (по умолчанию '#007bff').
     */
    color?: string;
    /**
     * Толщина линии (по умолчанию 2).
     */
    strokeWidth?: number;
    /**
     * Пунктирная линия (по умолчанию false).
     */
    dashed?: boolean;
    /**
     * Callback при клике на линию.
     */
    onClick?: () => void;
}

export interface ChainRecord {
    id: ChainId;
    from: ChainEndpoint;
    to: ChainEndpoint;
}

// Простейший реестр двусторонних ссылок (по Xanadu, XLA - Xanadu like app):
// ключ — цель (to), значение — список ссылок, ведущих сюда.
const backlinksRegistry = new Map<string, ChainRecord[]>();

// Реестр цветов для связей (для подсветки MarkdownLink)
const chainColorsRegistry = new Map<string, string>();

function endpointKey(endpoint: ChainEndpoint): string {
    const doc = endpoint.docId ?? '';
    const fragment = endpoint.fragmentId ?? '';
    return `${doc}#${fragment}`;
}

function registerChain(record: ChainRecord, color?: string) {
    const key = endpointKey(record.to);
    const list = backlinksRegistry.get(key) ?? [];

    // избегаем дубликатов по id
    if (!list.some((item) => item.id === record.id)) {
        backlinksRegistry.set(key, [...list, record]);
    }
    
    // Регистрируем цвет для целевой точки
    if (color) {
        chainColorsRegistry.set(key, color);
    }
}

function unregisterChain(record: ChainRecord) {
    const key = endpointKey(record.to);
    const list = backlinksRegistry.get(key);
    if (!list) return;

    const next = list.filter((item) => item.id !== record.id);
    if (next.length === 0) {
        backlinksRegistry.delete(key);
        chainColorsRegistry.delete(key);
    } else {
        backlinksRegistry.set(key, next);
    }
}

/**
 * Получить цвет связи для указанной точки (для подсветки MarkdownLink).
 */
export function getChainColor(target: ChainEndpoint): string | null {
    const key = endpointKey(target);
    return chainColorsRegistry.get(key) || null;
}

/**
 * Получить все входящие ссылки (backlinks) для указанной точки.
 */
export function getBacklinks(target: ChainEndpoint): ChainRecord[] {
    const key = endpointKey(target);
    return backlinksRegistry.get(key) ?? [];
}

/**
 * Получить позицию узла по его id.
 */
function getNodePosition(nodeId: string): { x: number; y: number; width: number; height: number; left: number; top: number; right: number; bottom: number } | null {
    const element = document.getElementById(nodeId);
    if (!element) return null;

    const rect = element.getBoundingClientRect();
    const graphElement = element.closest('.graph');
    if (!graphElement) return null;

    const graphRect = graphElement.getBoundingClientRect();
    
    return {
        x: rect.left - graphRect.left + rect.width / 2,
        y: rect.top - graphRect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
        left: rect.left - graphRect.left,
        top: rect.top - graphRect.top,
        right: rect.right - graphRect.left,
        bottom: rect.bottom - graphRect.top
    };
}

/**
 * Вычислить точку выхода линии из узла (на краю узла).
 */
function getEdgePoint(
    fromPos: { x: number; y: number; width: number; height: number; left: number; top: number; right: number; bottom: number },
    toPos: { x: number; y: number; width: number; height: number; left: number; top: number; right: number; bottom: number }
): { x: number; y: number } {
    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    
    // Определяем, к какому краю привязываться
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    
    let edgeX = fromPos.x;
    let edgeY = fromPos.y;
    
    // Определяем сторону выхода (левая/правая или верхняя/нижняя)
    if (absDx > absDy) {
        // Горизонтальное направление - привязываемся к левому или правому краю
        edgeX = dx > 0 ? fromPos.right : fromPos.left;
        // Вычисляем y на основе угла
        const ratio = absDy / absDx;
        const halfHeight = fromPos.height / 2;
        edgeY = fromPos.y + (dy > 0 ? halfHeight * ratio : -halfHeight * ratio);
    } else {
        // Вертикальное направление - привязываемся к верхнему или нижнему краю
        edgeY = dy > 0 ? fromPos.bottom : fromPos.top;
        // Вычисляем x на основе угла
        const ratio = absDx / absDy;
        const halfWidth = fromPos.width / 2;
        edgeX = fromPos.x + (dx > 0 ? halfWidth * ratio : -halfWidth * ratio);
    }
    
    return { x: edgeX, y: edgeY };
}

/**
 * Вычислить точку входа линии в узел (на краю узла).
 */
function getEntryPoint(
    fromPos: { x: number; y: number; width: number; height: number; left: number; top: number; right: number; bottom: number },
    toPos: { x: number; y: number; width: number; height: number; left: number; top: number; right: number; bottom: number }
): { x: number; y: number } {
    // Инвертируем направление для вычисления точки входа
    return getEdgePoint(toPos, fromPos);
}

/**
 * Компонент Chain — визуальная и логическая «двусторонняя ссылка»
 * в духе Xanadu (XLA - Xanadu like app). Отображает связь между узлами линией.
 */
export function Chain(props: ChainProps) {
    const { id, from, to, color = '#007bff', strokeWidth = 2, dashed = false, onClick } = props;
    const [fromPos, setFromPos] = useState<{ x: number; y: number } | null>(null);
    const [toPos, setToPos] = useState<{ x: number; y: number } | null>(null);
    
    const animationFrameRef = useRef<number>();

    const { chains: { relaitionType } } = store.getState();

    const isDashed = dashed || relaitionType?.[id] === 'dashed';

    const record: ChainRecord = { id, from, to };

    useEffect(() => {
        registerChain(record, color);
        return () => unregisterChain(record);
    }, [id, from.docId, from.fragmentId, to.docId, to.fragmentId, color]);

    // Отслеживание позиций узлов
    useEffect(() => {
        const updatePositions = () => {
            const fromNodeId = `${id}-${from.nodeId}`;
            const toNodeId = `${id}-${to.nodeId}`;

            if (fromNodeId && toNodeId) {
                const fromPosition = getNodePosition(fromNodeId);
                const toPosition = getNodePosition(toNodeId);

                if (fromPosition && toPosition) {
                    // Вычисляем точки на краях узлов
                    const fromEdge = getEdgePoint(fromPosition, toPosition);
                    const toEdge = getEntryPoint(fromPosition, toPosition);
                    setFromPos(fromEdge);
                    setToPos(toEdge);
                } else {
                    setFromPos(null);
                    setToPos(null);
                }
            }
        };

        // Обновляем позиции при монтировании
        updatePositions();

        // Обновляем позиции при скролле и ресайзе
        const handleUpdate = () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            animationFrameRef.current = requestAnimationFrame(updatePositions);
        };

        window.addEventListener('scroll', handleUpdate, true);
        window.addEventListener('resize', handleUpdate);
        
        // Периодическое обновление для отслеживания перемещения узлов
        const interval = setInterval(updatePositions, 100);

        return () => {
            window.removeEventListener('scroll', handleUpdate, true);
            window.removeEventListener('resize', handleUpdate);
            clearInterval(interval);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [from.nodeId, to.nodeId]);

    // Если нет позиций узлов, не рендерим линию
    if (!fromPos || !toPos) {
        return null;
    }

    const dataAttrs = {
        'data-xla-chain-id': id,
        'data-xla-chain-color': color,
        'data-xla-from-doc': from.docId ?? '',
        'data-xla-from-fragment': from.fragmentId ?? '',
        'data-xla-to-doc': to.docId ?? '',
        'data-xla-to-fragment': to.fragmentId ?? '',
    };

    // Вычисляем координаты для SVG линии
    const x1 = fromPos.x;
    const y1 = fromPos.y;
    const x2 = toPos.x;
    const y2 = toPos.y;

    // Вычисляем границы для SVG контейнера
    const minX = Math.min(x1, x2) - 10;
    const minY = Math.min(y1, y2) - 10;
    const maxX = Math.max(x1, x2) + 10;
    const maxY = Math.max(y1, y2) + 10;
    const width = maxX - minX;
    const height = maxY - minY;

    const markerId = `arrowhead-${id}`;

    return (
        <svg
            style={{
                position: 'absolute',
                left: minX,
                top:  minY,
                width: width,
                height: height,
                pointerEvents: onClick ? 'all' : 'none',
                zIndex: 1,
            }}
            {...dataAttrs}
            onClick={onClick}
        >
            <line
                x1={x1 - minX}
                y1={y1 - minY /* + Math.round(chains.anchorOffset[id]?.top + chains.anchorOffset[id]?.height / 2)*/}
                x2={x2 - minX}
                y2={y2 - minY /*+ Math.round(chains.anchorOffset[id]?.top + chains.anchorOffset[id]?.height / 2)*/}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={isDashed ? '5,5' : '0'}
                markerEnd={`url(#${markerId})`}
            />
        </svg>
    );
}

