import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify,
} from "lucide-react";
import { useEffect } from "react";

interface Props {
  content: string;
  onChange: (html: string) => void;
}

const normalizePastedText = (text: string) => {
  // Goal:
  // - Keep intentional blank lines as paragraph separators
  // - Avoid the "each wrapped line becomes a new paragraph" effect from PDFs/sites
  // - BUT also respect real line breaks when the user pasted short text with manual newlines
  const normalized = text
    .replace(/\r\n/g, "\n")
    // Treat "blank" lines that contain spaces/tabs as real blank lines
    .replace(/\n[ \t]+\n/g, "\n\n");

  // If the user already has paragraphs (blank lines), keep them and preserve
  // single line breaks inside each paragraph.
  if (/\n{2,}/.test(normalized)) {
    return normalized
      .split(/\n{2,}/)
      .map((block) => block.replace(/[ \t]+\n/g, "\n").trim())
      .filter(Boolean)
      .join("\n\n");
  }

  const lines = normalized.split("\n").map((l) => l.trimEnd());
  const nonEmpty = lines.filter((l) => l.trim().length > 0);

  // Heuristic: lots of single newlines (common in PDF wrapped text) → join with spaces.
  // Otherwise, preserve the newlines so the author’s breaks are respected.
  const looksLikeWrappedText = nonEmpty.length >= 7;
  if (looksLikeWrappedText) {
    return nonEmpty.join(" ").replace(/\s+/g, " ").trim();
  }

  return lines.join("\n").trim();
};

const RichTextEditor = ({ content, onChange }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      TextAlign.configure({ types: ["paragraph"] }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[280px] w-full px-4 md:px-6 py-4 focus:outline-none text-foreground/85 leading-relaxed prose-p:mb-3 prose-p:leading-relaxed whitespace-normal break-words [overflow-wrap:anywhere]",
      },
      transformPastedText: (text) => normalizePastedText(text),
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const Btn = ({ active, onClick, children, title }: { active?: boolean; onClick: () => void; children: React.ReactNode; title?: string }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-md transition-colors ${active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card min-w-0 w-full max-w-full mx-auto">
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-border bg-muted/30">
        <Btn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Negrito"><Bold size={15} /></Btn>
        <Btn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Itálico"><Italic size={15} /></Btn>
        <Btn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Sublinhado"><UnderlineIcon size={15} /></Btn>
        <span className="w-px h-5 bg-border mx-1.5" />
        <Btn active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Esquerda"><AlignLeft size={15} /></Btn>
        <Btn active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Centralizar"><AlignCenter size={15} /></Btn>
        <Btn active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Direita"><AlignRight size={15} /></Btn>
        <Btn active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()} title="Justificar"><AlignJustify size={15} /></Btn>
      </div>
      <div className="w-full min-w-0 overflow-hidden max-w-full">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
