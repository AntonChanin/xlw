import React, { useState, useRef, useEffect } from 'react';

export interface TooltipProps {
    /**
     * Содержимое тултипа.
     */
    content: React.ReactNode;
    /**
     * Элемент, к которому привязан тултип.
     */
    children: React.ReactElement;
    /**
     * Позиция тултипа относительно элемента.
     */
    position?: 'top' | 'bottom' | 'left' | 'right';
    /**
     * Задержка перед показом тултипа (в мс).
     */
    delay?: number;
    /**
     * Дополнительные CSS классы.
     */
    className?: string;
    /**
     * Инлайн стили для тултипа.
     */
    style?: React.CSSProperties;
}

export function Tooltip(props: TooltipProps) {
    const {
        content,
        children,
        position = 'top',
        delay = 300,
        className = '',
        style = {}
    } = props;

    const [isVisible, setIsVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const timeoutRef = useRef<number>();
    const tooltipRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement>(null);

    const showTooltip = (e: React.MouseEvent<HTMLElement>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
            setIsVisible(true);
            updatePosition(e);
        }, delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    const updatePosition = (e: React.MouseEvent<HTMLElement>) => {
        if (!tooltipRef.current || !triggerRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        let top = 0;
        let left = 0;

        switch (position) {
            case 'top':
                top = triggerRect.top + scrollY - tooltipRect.height - 8;
                left = triggerRect.left + scrollX + (triggerRect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'bottom':
                top = triggerRect.bottom + scrollY + 8;
                left = triggerRect.left + scrollX + (triggerRect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'left':
                top = triggerRect.top + scrollY + (triggerRect.height / 2) - (tooltipRect.height / 2);
                left = triggerRect.left + scrollX - tooltipRect.width - 8;
                break;
            case 'right':
                top = triggerRect.top + scrollY + (triggerRect.height / 2) - (tooltipRect.height / 2);
                left = triggerRect.right + scrollX + 8;
                break;
        }

        setTooltipPosition({ top, left });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        if (isVisible) {
            updatePosition(e);
        }
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const triggerElement = React.cloneElement(children, {
        ref: triggerRef,
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
        onMouseMove: handleMouseMove,
    });

    return (
        <>
            {triggerElement}
            {isVisible && (
                <div
                    ref={tooltipRef}
                    className={`tooltip tooltip-${position} ${className}`}
                    style={{
                        position: 'absolute',
                        top: tooltipPosition.top,
                        left: tooltipPosition.left,
                        zIndex: 10000,
                        padding: '6px 12px',
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        color: '#fff',
                        borderRadius: '4px',
                        fontSize: '12px',
                        lineHeight: '1.4',
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                        ...style
                    }}
                >
                    {content}
                    <div
                        style={{
                            position: 'absolute',
                            width: 0,
                            height: 0,
                            borderStyle: 'solid',
                            ...(position === 'top' && {
                                bottom: '-6px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                borderWidth: '6px 6px 0 6px',
                                borderColor: 'rgba(0, 0, 0, 0.85) transparent transparent transparent',
                            }),
                            ...(position === 'bottom' && {
                                top: '-6px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                borderWidth: '0 6px 6px 6px',
                                borderColor: 'transparent transparent rgba(0, 0, 0, 0.85) transparent',
                            }),
                            ...(position === 'left' && {
                                right: '-6px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                borderWidth: '6px 0 6px 6px',
                                borderColor: 'transparent transparent transparent rgba(0, 0, 0, 0.85)',
                            }),
                            ...(position === 'right' && {
                                left: '-6px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                borderWidth: '6px 6px 6px 0',
                                borderColor: 'transparent rgba(0, 0, 0, 0.85) transparent transparent',
                            }),
                        }}
                    />
                </div>
            )}
        </>
    );
}
