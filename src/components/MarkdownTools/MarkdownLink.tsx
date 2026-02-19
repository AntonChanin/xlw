import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { getChainColor } from '../Chain/Chain';
import store, { setAnchor, setAnchorOffsets } from '../../store';
// Специальный компонент-ссылка для Markdown.
// Сейчас ведёт себя как обычный <a>, но позже
// сюда можно будет добавить свою логику (ноды, роутинг и т.п.).

export interface MarkdownLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children?: React.ReactNode;
  anchor?: string;
  parentId?: string;
}

/**
 * Вычисляет яркость цвета (luminance) для определения читаемости текста.
 */
function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0.5;
  
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Конвертирует hex цвет в RGB.
 */
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

/**
 * Получить цвет фона с учетом читаемости текста.
 */
function getReadableBackground( color: string, isHover = false): { backgroundColor: string; color: string } {
  const luminance = getLuminance(color);
  
  // Если цвет темный (низкая яркость), используем светлый фон
  if (luminance < 0.5) {
    // Темный цвет - используем светлый полупрозрачный фон
    return {
      backgroundColor: `rgba(${hexToRgb(color)?.r || 0}, ${hexToRgb(color)?.g || 0}, ${hexToRgb(color)?.b || 0}, ${isHover ? 0.5 : 1})`, // 0.15
      color: '#000'
    };
  } else {
    // Светлый цвет - используем темный полупрозрачный фон
    return {
      backgroundColor: `rgba(${hexToRgb(color)?.r || 255}, ${hexToRgb(color)?.g || 255}, ${hexToRgb(color)?.b || 255}, ${isHover ? 0.5 : 1})`, //0.2
      color: '#fff'
    };
  }
}

export function MarkdownLink(props: MarkdownLinkProps) {
  const { href, children, parentId = '', ...rest } = props;
  const [chainColor, setChainColor] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  
  const { anchors: { anchor }, chains: { chains } } = store.getState();

  const linkRef = useRef<HTMLAnchorElement>(null);

  const dispatch = useDispatch();

  
  useEffect(() => {
    const [docId] = href.split('#');
    dispatch(setAnchorOffsets({ key: docId, value: linkRef?.current?.getBoundingClientRect() || null }));
  }, [linkRef]);
  

  useEffect(() => {
    if (!href) return;
    
    // Парсим href для извлечения docId и fragmentId
    const [docId, fragmentId] = href.split('#');
    
    // Получаем цвет из реестра Chain
    const color = chains.find(({ id }) => id === href)?.color || getChainColor({
      docId: docId || undefined,
      fragmentId: fragmentId || undefined
    });
    
    setChainColor(color);
    
    // Также проверяем периодически на случай, если Chain еще не зарегистрирован
    const interval = setInterval(() => {
      const updatedColor = chains.find(({ id }) => id === href)?.color || getChainColor({
        docId: docId || undefined,
        fragmentId: fragmentId || undefined
      });
    
      if (updatedColor !== color) {
        setChainColor(updatedColor);
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, [href]);

  const linkStyle: React.CSSProperties = useMemo(() => ({
    textDecoration: 'none',
    padding: '2px 4px',
    borderRadius: '3px',
    transition: 'all 0.2s ease',
    ...(chainColor ? getReadableBackground(chainColor, hover || anchor === href) : {}),
    ...rest.style,
  }), [anchor, chainColor]);

  return (
    <a
      id={`${href}-${parentId}`}
      ref={linkRef}
      href={href}
      {...rest}
      style={{ ...linkStyle }}
      onMouseOver={() => {
        setHover(true);
        dispatch(setAnchor(href));
      }}
      onMouseLeave={() => {
        setHover(false);
        dispatch(setAnchor(''));
      }}
    >
      {children}
    </a>
  );
}

