"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Button } from '@workspace/ui/components/button'
import { 
  Bold, Italic, Strikethrough, Code, 
  Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, 
  Undo, Redo, Link as LinkIcon, Image as ImageIcon
} from 'lucide-react'

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: 'Mulai menulis cerita Anda di sini...',
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert focus:outline-none min-h-[500px] w-full max-w-none p-6'
      }
    }
  })

  if (!editor) {
    return null
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)
    if (url === null) {
      return
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const addImage = () => {
    const url = window.prompt('URL Gambar')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="border rounded-xl overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/40">
        <Button
          variant="ghost" size="sm" className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleBold().run()}
          data-active={editor.isActive('bold')}
        >
          <Bold className="size-4" />
        </Button>
        <Button
          variant="ghost" size="sm" className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          data-active={editor.isActive('italic')}
        >
          <Italic className="size-4" />
        </Button>
        <Button
          variant="ghost" size="sm" className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          data-active={editor.isActive('strike')}
        >
          <Strikethrough className="size-4" />
        </Button>
        <Button
          variant="ghost" size="sm" className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleCode().run()}
          data-active={editor.isActive('code')}
        >
          <Code className="size-4" />
        </Button>

        <div className="w-[1px] h-4 bg-border mx-1" />

        <Button
          variant="ghost" size="sm" className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          data-active={editor.isActive('heading', { level: 1 })}
        >
          <Heading1 className="size-4" />
        </Button>
        <Button
          variant="ghost" size="sm" className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          data-active={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 className="size-4" />
        </Button>
        <Button
          variant="ghost" size="sm" className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          data-active={editor.isActive('heading', { level: 3 })}
        >
          <Heading3 className="size-4" />
        </Button>

        <div className="w-[1px] h-4 bg-border mx-1" />

        <Button
          variant="ghost" size="sm" className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          data-active={editor.isActive('bulletList')}
        >
          <List className="size-4" />
        </Button>
        <Button
          variant="ghost" size="sm" className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          data-active={editor.isActive('orderedList')}
        >
          <ListOrdered className="size-4" />
        </Button>
        <Button
          variant="ghost" size="sm" className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          data-active={editor.isActive('blockquote')}
        >
          <Quote className="size-4" />
        </Button>

        <div className="w-[1px] h-4 bg-border mx-1" />

        <Button
          variant="ghost" size="sm" className="h-8 w-8 p-0"
          onClick={setLink}
          data-active={editor.isActive('link')}
        >
          <LinkIcon className="size-4" />
        </Button>
        <Button
          variant="ghost" size="sm" className="h-8 w-8 p-0"
          onClick={addImage}
        >
          <ImageIcon className="size-4" />
        </Button>

        <div className="flex-1" />

        <Button
          variant="ghost" size="sm" className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="size-4" />
        </Button>
        <Button
          variant="ghost" size="sm" className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="size-4" />
        </Button>
      </div>

      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        button[data-active="true"] {
          background-color: var(--primary);
          color: var(--primary-foreground);
        }
      `}</style>
      
      <EditorContent editor={editor} className="bg-background cursor-text" />
    </div>
  )
}
