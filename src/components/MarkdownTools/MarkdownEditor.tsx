export function MarkdownEditor({ text, setText }: { text: string; setText: (value: string) => void }) {

    return  (
        <textarea
            style={{ maxWidth: '100%', minWidth: '100%', height: '400px' }}
            id="message" name="message"
            rows={4} cols={50}
            value={text}
            onChange={(e) => setText(e.target.value)}
        />
    );
}