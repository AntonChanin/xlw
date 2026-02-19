import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

import { MarkdownLink } from './MarkdownLink';
import { getChainColor } from '../Chain/Chain';

interface MarkdownFragmentProps {
    content?: string;
    filePath?: string;
    /**
     * Идентификатор документа для получения цвета связи (для выделения цитат).
     */
    docId?: string[];
    className?: string;
    style?: React.CSSProperties;
    active?: boolean;
    anchor?: string;
}

export function MarkdownFragment(props: MarkdownFragmentProps) {
    const {
        content,
        filePath,
        docId,
        className = '',
        style = {},
        active,
        anchor
    } = props;

    const bq: string[] = content.split('').filter((c) => c === '>');
    const [markdownContent, setMarkdownContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Загрузка markdown из файла
    useEffect(() => {
        if (filePath) {
            setIsLoading(true);
            setError(null);
            
            fetch(filePath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to load markdown file: ${response.statusText}`);
                    }
                    return response.text();
                })
                .then(text => {
                    setMarkdownContent(text);
                    setIsLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setIsLoading(false);
                });
        } else if (content) {
            setMarkdownContent(content);
        }
    }, [filePath, content]);

    if (isLoading) {
        return (
            <div className={`markdown-fragment markdown-loading ${className}`} style={style}>
                <div>Загрузка...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`markdown-fragment markdown-error ${className}`} style={style}>
                <div style={{ color: 'red' }}>Ошибка: {error}</div>
            </div>
        );
    }

    if (!markdownContent) {
        return (
            <div className={`markdown-fragment markdown-empty ${className}`} style={style}>
                <div>Нет контента для отображения</div>
            </div>
        );
    }

    // Получаем цвет связи для выделения цитат
    const quoteColor = bq.map((_, index) => docId ? getChainColor({ docId: docId[index || 0] }) : null);

    let i = -1;

    return (
        <div
            className={`markdown-fragment ${className}`}
            style={{
                padding: '8px',
                fontSize: '14px',
                lineHeight: '1.6',
                ...style
            }}
        >
            <ReactMarkdown
                components={{
                    a: (props) => <MarkdownLink parentId={docId[0]} {...{anchor: active ? anchor : ''}} {...props} />,
                    blockquote: ({ children, ...props }) => {
                        // Используем цвет связи для выделения цитаты, если он есть
                        const color = quoteColor[i] || '#007bff';
                        const rgb = hexToRgb(color);
                        const luminance = getLuminance(color);
                        i++;
                        
                        const backgroundColor = rgb
                            ? luminance < 0.5
                                ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`
                                : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`
                            : 'rgba(0, 123, 255, 0.1)';
                        
                        return (
                            <blockquote
                                {...props}
                                style={{
                                    margin: '8px 0',
                                    padding: '8px 12px',
                                    borderLeft: `4px solid ${color}`,
                                    backgroundColor: backgroundColor,
                                    borderRadius: '4px',
                                    fontStyle: 'italic',
                                }}
                            >
                                {children}
                            </blockquote>
                        );
                    }
                }}
            >
                {markdownContent}
            </ReactMarkdown>
        </div>
    );
}

// Вспомогательные функции для работы с цветом
function getLuminance(hex: string): number {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0.5;
    
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
        val = val / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

