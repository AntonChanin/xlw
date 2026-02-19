import { Marked } from '@ts-stack/markdown';

/**
 * Преобразует markdown-строку в TypeScript‑модуль.
 *
 * Пример результата:
 *   // Auto-generated from README.md
 *   export const doc = `...`;
 *   export default doc;
 */
export function mdToTs(
  markdown: string,
  options?: {
    varName?: string;
    fileComment?: string;
    asDefaultExport?: boolean;
  },
): string {
  const {
    varName = 'markdown',
    fileComment = '// Auto-generated from .md file, do not edit by hand.',
    asDefaultExport = true,
  } = options || {};

  // Безопасно экранируем содержимое для template literal
  const safe = markdown
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');

  const lines: string[] = [];
  if (fileComment) {
    lines.push(fileComment);
  }
  lines.push(`export const ${varName} = \`` + safe + '\`;');

  if (asDefaultExport) {
    lines.push(`export default ${varName};`);
  }

  return lines.join('\n') + '\n';
}

/**
 * Пытается извлечь markdown‑строку из TypeScript‑модуля,
 * созданного через `mdToTs`.
 *
 * Возвращает markdown или null, если строка не найдена.
 */
export function tsToMd(tsSource: string, varName = 'markdown'): string | null {
  // Ищем export const <varName> = `...`;
  const regexp = new RegExp(
    String.raw`export\s+const\s+${varName}\s*=\s*\`([\s\S]*?)\`;`,
    'm',
  );
  const match = tsSource.match(regexp);
  if (!match) {
    return null;
  }

  const raw = match[1];

  // Восстанавливаем исходный markdown
  return raw
    .replace(/\\`/g, '`')
    .replace(/\\\$\{/g, '${');
}

/**
 * Вспомогательная функция: парсит markdown в HTML.
 * Можно использовать при предпросмотре.
 */
export function mdToHtml(markdown: string): string {
  return Marked.parse(markdown);
}

