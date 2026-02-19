import { MarkdownEditor } from './MarkdownEditor';
import { MarkdownFragment } from './MarkdownFragment';
import { MarkdownLink } from './MarkdownLink';

// Объект по аналогии с React.<Поле>,
// позволяющий обращаться к любому экспортируемому
// из папки функционалу через точку.
const MarkdownTools = {
    MarkdownEditor,
    MarkdownFragment,
    MarkdownLink,
};

export default MarkdownTools;
export { MarkdownFragment, MarkdownLink, MarkdownTools };

