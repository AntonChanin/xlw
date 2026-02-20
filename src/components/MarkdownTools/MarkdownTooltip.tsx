import store from '../../store';

import './markdown.css';

interface MarkdownTooltipProps extends React.ClassAttributes<HTMLElement>, React.HTMLAttributes<HTMLElement>  {
    id: string;
    content?: string;
    tooltip?: string;
}

export function MarkdownTooltip({ children, content: ctn, tooltip: ttp, ...other }: MarkdownTooltipProps) {
    const { tooltips: { tooltips } } = store.getState();
    const { content = ctn, tooltip = ttp } = tooltips?.[children.toString()] || { content: ctn, tooltip: ttp };

    return (
        <em id={children.toString()} /*data-tip={tooltip}*/ title={tooltip} {...other}>{content}</em>
    );
}