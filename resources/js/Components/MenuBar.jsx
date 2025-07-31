import React from "react";
import {
    Bold,
    Italic,
    Strikethrough,
    ChevronDown,
    UnderlineIcon,
    TextQuote,
    Type,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
} from "lucide-react";
import ButtonMenu from "./ButtonMenu";
import { useList } from "./tiptap-ui/list-button";

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

const DropdownMenu = ({ children, isOpen, setIsOpen, menuRef }) => (
    <div className="relative" ref={menuRef}>
        {React.Children.map(children, (child) =>
            React.cloneElement(child, { isOpen, setIsOpen })
        )}
    </div>
);

export default function MenuBar({ editor, isOpen, setIsOpen, menuRef }) {
    if (!editor) {
        return null;
    }

    const [editorState, setEditorState] = React.useState({
        isBold: false,
        isItalic: false,
        isUnderline: false,
        isStrikethrough: false,
        isBlockquote: false,
        isAlignLeft: false,
        isAlignCenter: false,
        isAlignRight: false,
        isAlignJustify: false,
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
                isBlockquote: editor.isActive("blockquote") ?? false,
                isAlignLeft: editor.isActive({ textAlign: "left" }) ?? false,
                isAlignCenter:
                    editor.isActive({ textAlign: "center" }) ?? false,
                isAlignRight: editor.isActive({ textAlign: "right" }) ?? false,
                isAlignJustify:
                    editor.isActive({ textAlign: "justify" }) ?? false,
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

    const bulletList = useList({
        editor,
        type: "bulletList",
        hideWhenUnavailable: false,
    });
    const orderedList = useList({
        editor,
        type: "orderedList",
        hideWhenUnavailable: false,
    });

    return (
        <div className="menu-bar w-full flex items-center  gap-2 p-3 bg-gray-50 border border-gray-200 rounded-t-lg">
            {/* Heading Dropdown */}

            {/* Divider */}
            {/* Format Buttons */}
            <div className="flex items-center md:items-center justify-center flex-wrap gap-1">
                {isVisible && (
                    <DropdownMenu
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        menuRef={menuRef}
                    >
                        <DropdownMenuTrigger
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                        >
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
                                        editor
                                            .chain()
                                            .focus()
                                            .setParagraph()
                                            .run();
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
                <div className="w-px h-6 bg-gray-300" />

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
                    title="Bold"
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
                    title="Italic"
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
                    title="Underline"
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
                    title="Strike through"
                >
                    <Strikethrough size={16} strokeWidth={2.5} />
                </ButtonMenu>

                <div className="w-px h-6 bg-gray-300" />

                <ButtonMenu
                    onClick={() => {
                        if (editor && !editor.isDestroyed) {
                            editor.chain().focus().setTextAlign &&
                                editor
                                    .chain()
                                    .focus()
                                    .setTextAlign("left")
                                    .run();
                        }
                    }}
                    disabled={
                        !editor ||
                        editor.isDestroyed ||
                        !(
                            editor.can().chain().focus().setTextAlign &&
                            editor
                                .can()
                                .chain()
                                .focus()
                                .setTextAlign("left")
                                .run()
                        )
                    }
                    isActive={editorState.isAlignLeft}
                    title="Align Left"
                >
                    <AlignLeft size={16} strokeWidth={2.5} />
                </ButtonMenu>
                <ButtonMenu
                    onClick={() => {
                        if (editor && !editor.isDestroyed) {
                            editor.chain().focus().setTextAlign &&
                                editor
                                    .chain()
                                    .focus()
                                    .setTextAlign("center")
                                    .run();
                        }
                    }}
                    disabled={
                        !editor ||
                        editor.isDestroyed ||
                        !(
                            editor.can().chain().focus().setTextAlign &&
                            editor
                                .can()
                                .chain()
                                .focus()
                                .setTextAlign("center")
                                .run()
                        )
                    }
                    isActive={editorState.isAlignCenter}
                    title="Align Center"
                >
                    <AlignCenter size={16} strokeWidth={2.5} />
                </ButtonMenu>
                <ButtonMenu
                    onClick={() => {
                        if (editor && !editor.isDestroyed) {
                            editor.chain().focus().setTextAlign &&
                                editor
                                    .chain()
                                    .focus()
                                    .setTextAlign("right")
                                    .run();
                        }
                    }}
                    disabled={
                        !editor ||
                        editor.isDestroyed ||
                        !(
                            editor.can().chain().focus().setTextAlign &&
                            editor
                                .can()
                                .chain()
                                .focus()
                                .setTextAlign("right")
                                .run()
                        )
                    }
                    isActive={editorState.isAlignRight}
                    title="Align Right"
                >
                    <AlignRight size={16} strokeWidth={2.5} />
                </ButtonMenu>
                <ButtonMenu
                    onClick={() => {
                        if (editor && !editor.isDestroyed) {
                            editor.chain().focus().setTextAlign &&
                                editor
                                    .chain()
                                    .focus()
                                    .setTextAlign("justify")
                                    .run();
                        }
                    }}
                    disabled={
                        !editor ||
                        editor.isDestroyed ||
                        !(
                            editor.can().chain().focus().setTextAlign &&
                            editor
                                .can()
                                .chain()
                                .focus()
                                .setTextAlign("justify")
                                .run()
                        )
                    }
                    isActive={editorState.isAlignJustify}
                    title="Align Justify"
                >
                    <AlignJustify size={16} strokeWidth={2.5} />
                </ButtonMenu>

                <div className="w-px h-6 bg-gray-300" />

                <ButtonMenu
                    onClick={() => {
                        if (editor && !editor.isDestroyed) {
                            editor.chain().focus().toggleBlockquote().run();
                        }
                    }}
                    disabled={
                        !editor ||
                        editor.isDestroyed ||
                        !editor.can().chain().focus().toggleBlockquote().run()
                    }
                    isActive={editorState.isBlockquote}
                    title="Blockquote"
                >
                    <TextQuote size={16} strokeWidth={2.5} />
                </ButtonMenu>

                <ButtonMenu
                    onClick={bulletList.handleToggle}
                    disabled={!bulletList.canToggle}
                    isActive={bulletList.isActive}
                    title="Bullet List"
                >
                    <List size={16} strokeWidth={2.5} />
                </ButtonMenu>

                <ButtonMenu
                    onClick={orderedList.handleToggle}
                    disabled={!orderedList.canToggle}
                    isActive={orderedList.isActive}
                    title="Ordered List"
                >
                    <ListOrdered size={16} strokeWidth={2.5} />
                </ButtonMenu>
            </div>
        </div>
    );
}
