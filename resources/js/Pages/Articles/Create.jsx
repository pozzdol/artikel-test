import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { router } from "@inertiajs/react";

import {
    Bold,
    Italic,
    Strikethrough,
    Type,
    ChevronDown,
    UnderlineIcon,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ButtonMenu from "@/Components/ButtonMenu";

// Mock form hook
const useForm = (initialData) => {
    const [data, setDataState] = React.useState(initialData);
    const [processing, setProcessing] = React.useState(false);
    const [errors, setErrors] = React.useState({});

    const setData = (key, value) => {
        setDataState((prev) => ({ ...prev, [key]: value }));
    };

    const post = (url, options = {}) => {
        setProcessing(true);
        router.post(url, options.data || data, {
            onFinish: () => setProcessing(false),
            onError: (err) => setErrors(err),
        });
    };

    return { data, setData, post, processing, errors };
};

// Heading Button Component
const HeadingButton = ({ editor, level, text, onClick }) => (
    <button
        onClick={() => {
            if (editor && !editor.isDestroyed) {
                editor.chain().focus().toggleHeading({ level }).run();
            }
            if (onClick) onClick();
        }}
        className={`w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors ${
            editor?.isActive("heading", { level })
                ? "bg-blue-50 text-blue-600"
                : ""
        }`}
    >
        {text}
    </button>
);

// Dropdown Menu Components (simplified)

const DropdownMenuTrigger = ({ children, isOpen, setIsOpen }) => (
    <div onClick={() => setIsOpen(!isOpen)}>{children}</div>
);

const DropdownMenuContent = ({ children, isOpen }) =>
    isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg min-w-[120px] z-10">
            {children}
        </div>
    );

const DropdownMenuItem = ({ children }) => (
    <div className="border-b border-gray-100 last:border-b-0">{children}</div>
);

// Custom hook for heading dropdown
const useHeadingDropdownMenu = ({ editor, levels = [1, 2, 3] }) => {
    if (!editor) {
        return {
            isVisible: false,
            activeLevel: null,
            isActive: false,
            canToggle: false,
            levels: [],
            label: "Paragraph",
            Icon: Type,
        };
    }

    const isActive = levels.some((level) =>
        editor.isActive("heading", { level })
    );
    const activeLevel = levels.find((level) =>
        editor.isActive("heading", { level })
    );

    return {
        isVisible: true,
        activeLevel,
        isActive,
        canToggle: true,
        levels,
        label: activeLevel ? `Heading ${activeLevel}` : "Paragraph",
        Icon: Type,
    };
};

// DropdownMenu moved outside so only one state is used
const DropdownMenu = ({ children, isOpen, setIsOpen, menuRef }) => (
    <div className="relative" ref={menuRef}>
        {React.Children.map(children, (child) =>
            React.cloneElement(child, { isOpen, setIsOpen })
        )}
    </div>
);

function MenuBar({ editor, isOpen, setIsOpen, menuRef }) {
    if (!editor) {
        return null;
    }

    const [editorState, setEditorState] = React.useState({
        isBold: false,
        isItalic: false,
        isUnderline: false,
        isStrikethrough: false,
    });

    // Update editor state
    React.useEffect(() => {
        if (!editor) return;

        const updateState = () => {
            setEditorState({
                isBold: editor.isActive("bold") ?? false,
                isItalic: editor.isActive("italic") ?? false,
                isUnderline: editor.isActive("underline") ?? false,
                isStrikethrough: editor.isActive("strike") ?? false,
            });
        };

        editor.on("selectionUpdate", updateState);
        editor.on("transaction", updateState);

        return () => {
            editor.off("selectionUpdate", updateState);
            editor.off("transaction", updateState);
        };
    }, [editor]);

    const { isVisible, activeLevel, isActive, canToggle, levels, label, Icon } =
        useHeadingDropdownMenu({
            editor,
            levels: [1, 2, 3],
        });

    return (
        <div className="menu-bar w-full flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-t-lg">
            {/* Heading Dropdown */}
            {isVisible && (
                <DropdownMenu
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    menuRef={menuRef}
                >
                    <DropdownMenuTrigger isOpen={isOpen} setIsOpen={setIsOpen}>
                        <button
                            type="button"
                            disabled={!canToggle}
                            aria-label={label}
                            aria-pressed={isActive}
                            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        >
                            <Icon size={16} />
                            <span className="text-sm">{label}</span>
                            <ChevronDown size={14} />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent isOpen={isOpen}>
                        <DropdownMenuItem>
                            <HeadingButton
                                editor={editor}
                                level={0}
                                text="Paragraph"
                                onClick={() => {
                                    editor.chain().focus().setParagraph().run();
                                    setIsOpen(false);
                                }}
                            />
                        </DropdownMenuItem>
                        {levels.map((level) => (
                            <DropdownMenuItem key={level}>
                                <HeadingButton
                                    editor={editor}
                                    level={level}
                                    text={`Heading ${level}`}
                                    onClick={() => setIsOpen(false)}
                                />
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            {/* Divider */}
            <div className="w-px h-6 bg-gray-300" />

            {/* Format Buttons */}
            <div className="flex items-center gap-1">
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
                    <Bold size={16} strokeWidth={2.5} />
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
                    <Italic size={16} strokeWidth={2.5} />
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
                    <UnderlineIcon size={16} strokeWidth={2.5} />
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
                    <Strikethrough size={16} strokeWidth={2.5} />
                </ButtonMenu>
            </div>
        </div>
    );
}

export default function Create() {
    const editor = useEditor({
        extensions: [StarterKit],
        content: `<p>Hi there! Start writing your article...</p>`,
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4",
            },
        },
    });

    useEffect(() => {
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

    useEffect(() => {
        if (editor) {
            const updateContent = () => {
                setData("content_html", editor.getHTML());
                setData("content_json", JSON.stringify(editor.getJSON()));
            };

            editor.on("update", updateContent);

            // Initial content update
            updateContent();

            // Cleanup
            return () => {
                if (editor && !editor.isDestroyed) {
                    editor.off("update", updateContent);
                }
            };
        }
        // Hapus setData dari dependency agar tidak infinite loop
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor]);

    // Dropdown state and ref for heading menu
    const [isOpen, setIsOpen] = React.useState(false);
    const menuRef = React.useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content_html", data.content_html);
        formData.append("content_json", data.content_json);
        if (data.hero_img) {
            formData.append("hero_img", data.hero_img);
        }
        post("/articles", { data: formData, forceFormData: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create New Article
                </h2>
            }
        >
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
                    {/* Form */}
                    <div className="p-6">
                        <div className="article-editor max-w-3xl mx-auto">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Title Input */}
                                <div>
                                    <input
                                        type="text"
                                        className="w-full text-2xl font-bold border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none pb-2 bg-transparent placeholder-gray-400"
                                        placeholder="Enter your article title..."
                                        value={data.title}
                                        required
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                    />
                                    {errors.title && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.title}
                                        </div>
                                    )}
                                </div>

                                {/* Contoh di Create.jsx */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setData("hero_img", e.target.files[0])
                                    }
                                />
                                {/* Editor */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <MenuBar
                                        editor={editor}
                                        isOpen={isOpen}
                                        setIsOpen={setIsOpen}
                                        menuRef={menuRef}
                                    />
                                    <div className="bg-white min-h-[400px]">
                                        <EditorContent editor={editor} />
                                    </div>
                                </div>
                                {errors.content_html && (
                                    <div className="text-red-500 text-sm">
                                        {errors.content_html}
                                    </div>
                                )}
                                {/* Submit Button */}
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Publishing...
                                            </>
                                        ) : (
                                            "Publish Article"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
