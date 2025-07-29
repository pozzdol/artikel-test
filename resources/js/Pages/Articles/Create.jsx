import { useEditorState, useEditor, EditorContent } from "@tiptap/react";
import React from "react";
import { StarterKit } from "@tiptap/starter-kit";

import "../../../css/style.css";
import ButtonMenu from "@/Components/ButtonMenu";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { Bold, Italic, Strikethrough, Underline } from "lucide-react";

function MenuBar({ editor }) {
    if (!editor) {
        return null;
    }

    const editorState = useEditorState({
        editor,
        selector: (ctx) => {
            if (!ctx.editor)
                return {
                    isBold: false,
                    isItalic: false,
                    isUnderline: false,
                    isStrikethrough: false,
                };
            return {
                isBold: ctx.editor.isActive("bold") ?? false,
                isItalic: ctx.editor.isActive("italic") ?? false,
                isUnderline: ctx.editor.isActive("underline") ?? false,
                isStrikethrough: ctx.editor.isActive("strike") ?? false,
            };
        },
    });

    return (
        <div className="menu-bar w-full flex items-center justify-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
            <ButtonMenu
                onClick={() => {
                    if (editor && !editor.isDestroyed) {
                        editor.chain().focus().toggleBold().run();
                    }
                }}
                disabled={
                    !editor ||
                    editor.isDestroyed ||
                    !editor.can().chain().focus().toggleBold().run()
                }
                isActive={editorState.isBold}
            >
                <Bold size={16} strokeWidth={3} />
            </ButtonMenu>

            <ButtonMenu
                onClick={() => {
                    if (editor && !editor.isDestroyed) {
                        editor.chain().focus().toggleItalic().run();
                    }
                }}
                disabled={
                    !editor ||
                    editor.isDestroyed ||
                    !editor.can().chain().focus().toggleItalic().run()
                }
                isActive={editorState.isItalic}
            >
                <Italic size={16} strokeWidth={3} />
            </ButtonMenu>

            <ButtonMenu
                onClick={() => {
                    if (editor && !editor.isDestroyed) {
                        editor.chain().focus().toggleUnderline().run();
                    }
                }}
                disabled={
                    !editor ||
                    editor.isDestroyed ||
                    !editor.can().chain().focus().toggleUnderline().run()
                }
                isActive={editorState.isUnderline}
            >
                <Underline size={16} strokeWidth={3} />
            </ButtonMenu>

            <ButtonMenu
                onClick={() => {
                    if (editor && !editor.isDestroyed) {
                        editor.chain().focus().toggleStrike().run();
                    }
                }}
                disabled={
                    !editor ||
                    editor.isDestroyed ||
                    !editor.can().chain().focus().toggleStrike().run()
                }
                isActive={editorState.isStrikethrough}
            >
                <Strikethrough size={16} strokeWidth={3} />
            </ButtonMenu>
        </div>
    );
}

export default function Create() {
    const editor = useEditor({
        extensions: [StarterKit],
        content: `<p>Hi there! Start writing your article...</p>`,
        editorProps: {
            attributes: {
                class: "tiptap ProseMirror",
            },
        },
    });

    React.useEffect(() => {
        return () => {
            if (editor && !editor.isDestroyed) {
                editor.destroy();
            }
        };
    }, [editor]);

    const { data, setData, post, processing, errors } = useForm({
        title: "",
        content_html: "",
        content_json: "",
    });

    React.useEffect(() => {
        if (editor) {
            const updateContent = () => {
                setData("content_html", editor.getHTML());
                setData("content_json", JSON.stringify(editor.getJSON()));
            };
            editor.on("update", updateContent);
            // Cleanup
            return () => editor.off("update", updateContent);
        }
    }, [editor, setData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editor) {
            post("/articles", {
                data: {
                    title: data.title,
                    content_html: data.content_html,
                    content_json: data.content_json,
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create New Article
                </h2>
            }
        >
            <Head title="Create New Article" />
            <div className="article-editor max-w-3xl mx-auto p-4 flex flex-col space-y-2">
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2"
                            placeholder="Title"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                        />
                        {errors.title && (
                            <div className="text-red-500 text-sm">
                                {errors.title}
                            </div>
                        )}
                    </div>
                    <MenuBar editor={editor} />
                    <EditorContent editor={editor} />
                    {errors.content_html && (
                        <div className="text-red-500 text-sm">
                            {errors.content_html}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                        disabled={processing}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
