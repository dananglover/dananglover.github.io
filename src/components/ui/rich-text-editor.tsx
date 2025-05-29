
import { Button } from '@/components/ui/button';
import { Bold, Italic, Strikethrough, Underline, List, ListOrdered, Heading1, Heading2, Heading3 } from 'lucide-react';
import React, { useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing...",
  className,
  minHeight = "200px"
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  React.useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const toolbarButtons = [
    { command: 'bold', icon: Bold, title: 'Bold' },
    { command: 'italic', icon: Italic, title: 'Italic' },
    { command: 'underline', icon: Underline, title: 'Underline' },
    { command: 'strikeThrough', icon: Strikethrough, title: 'Strikethrough' },
    { command: 'insertUnorderedList', icon: List, title: 'Bullet List' },
    { command: 'insertOrderedList', icon: ListOrdered, title: 'Numbered List' },
    { command: 'formatBlock', icon: Heading1, title: 'Heading 1', value: 'h1' },
    { command: 'formatBlock', icon: Heading2, title: 'Heading 2', value: 'h2' },
    { command: 'formatBlock', icon: Heading3, title: 'Heading 3', value: 'h3' },
  ];

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        {toolbarButtons.map((button, index) => {
          const Icon = button.icon;
          return (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand(button.command, button.value)}
              title={button.title}
              className="h-8 w-8 p-0"
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        className={cn(
          "p-3 outline-none focus:ring-0 overflow-auto",
          "prose prose-sm max-w-none",
          "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-2",
          "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-2",
          "[&_h3]:text-lg [&_h3]:font-medium [&_h3]:mb-2",
          "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-2",
          "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-2",
          "[&_li]:mb-1",
          "[&_p]:mb-2",
          "[&_strong]:font-bold",
          "[&_em]:italic",
          "[&_u]:underline",
          "empty:before:content-[attr(data-placeholder)] empty:before:text-gray-500"
        )}
        style={{ minHeight }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
    </div>
  );
};
