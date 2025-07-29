export default function Toolbar({ editor }) {
    if (!editor) return null;

    const addImage = () => {
        const url = prompt("Masukkan URL gambar:");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href;
        const url = prompt("URL Link:", previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        // update link
        editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
    };

    return (
        <div className="flex flex-wrap gap-2 bg-gray-100 border border-gray-300 rounded-t-md p-2">
            {/* Undo/Redo */}
            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Undo"
            >
                ↶
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Redo"
            >
                ↷
            </button>

            {/* Separator */}
            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Headings */}
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={`px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 ${
                    editor.isActive("heading", { level: 1 })
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                }`}
                title="Heading 1"
            >
                H1
            </button>
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={`px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 ${
                    editor.isActive("heading", { level: 2 })
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                }`}
                title="Heading 2"
            >
                H2
            </button>
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={`px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 ${
                    editor.isActive("heading", { level: 3 })
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                }`}
                title="Heading 3"
            >
                H3
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={`px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 ${
                    editor.isActive("paragraph")
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                }`}
                title="Paragraph"
            >
                P
            </button>

            {/* Separator */}
            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Text Formatting */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 ${
                    editor.isActive("bold")
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                }`}
                title="Bold"
            >
                <strong>B</strong>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 ${
                    editor.isActive("italic")
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                }`}
                title="Italic"
            >
                <em>I</em>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                disabled={!editor.can().chain().focus().toggleUnderline().run()}
                className={`px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 ${
                    editor.isActive("underline")
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                }`}
                title="Underline"
            >
                <u>U</u>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={`px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 ${
                    editor.isActive("strike")
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                }`}
                title="Strikethrough"
            >
                <s>S</s>
            </button>

            {/* Separator */}
            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Lists */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 ${
                    editor.isActive("bulletList")
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                }`}
                title="Bullet List"
            >
                •
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 ${
                    editor.isActive("orderedList")
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                }`}
                title="Numbered List"
            >
                1.
            </button>

            {/* Separator */}
            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Text Alignment */}
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                }
                className={`px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 ${
                    editor.isActive({ textAlign: "left" })
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                }`}
                title="Align Left"
            >
                ⇤
            </button>
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                }
                className={`px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 ${
                    editor.isActive({ textAlign: "center" })
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                }`}
                title="Align Center"
            >
                ⏺
            </button>
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                }
                className={`px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 ${
                    editor.isActive({ textAlign: "right" })
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                }`}
                title="Align Right"
            >
                ⇥
            </button>

            {/* Separator */}
            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Subscript/Superscript */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleSubscript().run()}
                className={`px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 ${
                    editor.isActive("subscript")
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                }`}
                title="Subscript"
            >
                x₂
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
                className={`px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 ${
                    editor.isActive("superscript")
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                }`}
                title="Superscript"
            >
                x²
            </button>

            {/* Separator */}
            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Link & Image */}
            <button
                type="button"
                onClick={setLink}
                className={`px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 ${
                    editor.isActive("link")
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                }`}
                title="Add/Edit Link"
            >
                🔗
            </button>
            <button
                type="button"
                onClick={addImage}
                className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 bg-white"
                title="Add Image"
            >
                🖼️
            </button>
        </div>
    );
}
