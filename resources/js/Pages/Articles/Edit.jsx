import React, { useEffect, useRef, useState } from "react";
import ImageCropper from "./ImageCropper";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Head, router } from "@inertiajs/react";

import {
    Bold,
    Italic,
    Strikethrough,
    Type,
    ChevronDown,
    UnderlineIcon,
    TextQuote,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ButtonMenu from "@/Components/ButtonMenu";
import MenuBar from "@/Components/MenuBar";
import TextAlign from "@tiptap/extension-text-align";

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

export default function Edit({ article }) {
    const [showCropper, setShowCropper] = useState(false);
    const [rawImage, setRawImage] = useState(null);
    const [croppedPreview, setCroppedPreview] = useState(null);
    const [croppedBlob, setCroppedBlob] = useState(null);
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
        ],
        content: article.content_html,
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
        title: article.title || "",
        content_html: article.content_html || "",
        content_json: article.content_json || "",
        hero_img: article.hero_img || "",
    });

    // Handler untuk input file, tampilkan cropper
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setRawImage(URL.createObjectURL(e.target.files[0]));
            setShowCropper(true);
        }
    };

    // Handler setelah crop (preview saja)
    const handleCropPreview = (blob) => {
        setCroppedPreview(URL.createObjectURL(blob));
        setCroppedBlob(blob);
    };

    // Handler simpan hasil crop ke form
    const handleCropSave = () => {
        setData("hero_img", croppedBlob);
        setShowCropper(false);
        setRawImage(null);
    };

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
        formData.append("_method", "PATCH");
        formData.append("title", data.title);
        formData.append("content_html", data.content_html);
        formData.append("content_json", data.content_json);
        if (data.hero_img && typeof data.hero_img !== "string") {
            formData.append("hero_img", data.hero_img);
        }
        if (data.hero_img === "") {
            formData.append("remove_hero_img", "1");
        }
        post(route("articles.update", article.id), {
            data: formData,
            forceFormData: true,
            onFinish: () => {},
        });
    };

    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
                textareaRef.current.scrollHeight + "px";
        }
    }, [data.title]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Artikel: {article.title || "Tulis Artikel Baru"}
                </h2>
            }
        >
            <Head
                title={`Edit Artikel: ${article.title || "Tulis Artikel Baru"}`}
            />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-5xl mx-auto py-12 px-6">
                    {/* Main Form Container */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 overflow-hidden">
                        <div className="p-8 lg:p-12">
                            <div className="article-editor max-w-4xl mx-auto">
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-8"
                                >
                                    {/* Title Input */}
                                    <div className="group">
                                        <div className="relative">
                                            <textarea
                                                ref={textareaRef}
                                                className="w-full text-3xl font-bold border-0 pb-4 bg-transparent placeholder-gray-400 transition-all duration-300 group-hover:border-gray-300 resize-none"
                                                placeholder="Judul artikel yang menarik..."
                                                value={data.title}
                                                required
                                                onChange={(e) =>
                                                    setData(
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                                rows={1}
                                                style={{ overflow: "hidden" }}
                                                onInput={(e) => {
                                                    e.target.style.height =
                                                        "auto";
                                                    e.target.style.height =
                                                        e.target.scrollHeight +
                                                        "px";
                                                }}
                                            />
                                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-focus-within:w-full"></div>
                                        </div>
                                        {errors.title && (
                                            <div className="flex items-center gap-2 text-red-500 text-sm mt-2 animate-fadeIn">
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                {errors.title}
                                            </div>
                                        )}
                                    </div>

                                    {/* Hero Image Upload */}
                                    <div className="space-y-4">
                                        <label className="block text-xl font-semibold text-gray-800 mb-3">
                                            Gambar Utama (opsional)
                                        </label>

                                        <div className="flex flex-col sm:flex-row items-start gap-6">
                                            {/* Upload Button */}
                                            <label className="group inline-flex items-center px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-2xl cursor-pointer hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-300 transform hover:scale-105">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-500 rounded-xl text-white group-hover:bg-blue-600 transition-colors duration-200">
                                                        <svg
                                                            className="w-6 h-6"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                                                            Pilih Gambar
                                                        </span>
                                                        <p className="text-sm text-gray-500">
                                                            PNG, JPG maksimal
                                                            5MB
                                                        </p>
                                                    </div>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                />
                                            </label>

                                            {/* Image Preview */}
                                            {data.hero_img && (
                                                <div className="relative group/preview">
                                                    <div className="relative overflow-hidden rounded-2xl shadow-lg">
                                                        <img
                                                            src={
                                                                typeof data.hero_img ===
                                                                "string"
                                                                    ? `/storage/${data.hero_img}`
                                                                    : URL.createObjectURL(
                                                                          data.hero_img
                                                                      )
                                                            }
                                                            alt="Preview Hero"
                                                            className="h-24 w-32 object-cover transition-transform duration-300 group-hover/preview:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-200"></div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setData(
                                                                "hero_img",
                                                                ""
                                                            );
                                                            setCroppedPreview(
                                                                null
                                                            );
                                                            setCroppedBlob(
                                                                null
                                                            );
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transform hover:scale-110 transition-all duration-200"
                                                    >
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {errors.hero_img && (
                                            <div className="flex items-center gap-2 text-red-500 text-sm animate-fadeIn">
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                {errors.hero_img}
                                            </div>
                                        )}
                                    </div>

                                    {/* Rich Text Editor */}
                                    <div className="space-y-3">
                                        <label className="block text-xl font-semibold text-gray-800">
                                            Konten Artikel
                                        </label>

                                        <div className="border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                                            {/* Editor Toolbar */}
                                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                                <MenuBar
                                                    editor={editor}
                                                    isOpen={isOpen}
                                                    setIsOpen={setIsOpen}
                                                    menuRef={menuRef}
                                                />
                                            </div>

                                            {/* Editor Content Area */}
                                            <div className="bg-white overflow-auto h-[750px] md:min-h-[500px] relative">
                                                <EditorContent
                                                    editor={editor}
                                                    className="prose prose-lg max-w-none p-6 focus:outline-none"
                                                />

                                                {/* Editor Placeholder/Guide */}
                                                {!editor?.getHTML() ||
                                                editor.getHTML() ===
                                                    "<p></p>" ? (
                                                    <div className="absolute top-6 left-6 pointer-events-none text-gray-400">
                                                        <p className="text-lg">
                                                            Mulai menulis
                                                            artikel Anda...
                                                        </p>
                                                        <p className="text-sm mt-1">
                                                            Gunakan toolbar di
                                                            atas untuk memformat
                                                            konten
                                                        </p>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                        {errors.content_html && (
                                            <div className="flex items-center gap-2 text-red-500 text-sm animate-fadeIn">
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                {errors.content_html}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-8 border-t border-gray-200">
                                        {/* Publish Button */}
                                        <button
                                            type="submit"
                                            className="w-full sm:w-auto group relative px-4 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                                            disabled={processing}
                                        >
                                            {/* Button Content */}
                                            <div className="relative flex items-center justify-center gap-3">
                                                {processing ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        <span>Mengirim...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg
                                                            className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                                            />
                                                        </svg>
                                                        <span>
                                                            Publikasikan Artikel
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Animated Background */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Tips Section */}
                    <div className="mt-12 grid md:grid-cols-3 gap-6">
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                    />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">
                                Tips Menulis
                            </h3>
                            <p className="text-sm text-gray-600">
                                Mulailah dengan kalimat pembuka yang menarik dan
                                susun konten dengan heading yang jelas.
                            </p>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">
                                Panduan Gambar
                            </h3>
                            <p className="text-sm text-gray-600">
                                Gunakan gambar berkualitas tinggi yang relevan
                                dan ukuran yang sesuai dengan konten.
                            </p>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                                <svg
                                    className="w-6 h-6 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                    />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">
                                Praktik Terbaik
                            </h3>
                            <p className="text-sm text-gray-600">
                                Baca ulang tulisan Anda, gunakan format yang
                                baik, dan ajak pembaca untuk berinteraksi.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Cropper Fullscreen */}
            {/* Modal Cropper Fullscreen - Responsive & Modern Design */}
            {showCropper && rawImage && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
                    {/* Mobile/Desktop Layout Container */}
                    <div className="relative w-full h-full flex flex-col">
                        {/* Header Bar - Fixed at top */}
                        <div className="flex-shrink-0 px-4 py-4 md:px-6 lg:px-8">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
                                <div className="px-4 py-3 md:px-6 md:py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                                <svg
                                                    className="w-5 h-5 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <h2 className="text-white font-bold text-lg md:text-xl">
                                                    Crop Image
                                                </h2>
                                                <p className="text-white/70 text-sm hidden sm:block">
                                                    Sesuaikan gambar dengan
                                                    ukuran yang sempurna
                                                </p>
                                            </div>
                                        </div>

                                        {/* Close Button */}
                                        <button
                                            onClick={() => {
                                                setShowCropper(false);
                                                setRawImage(null);
                                                setCroppedPreview(null);
                                                setCroppedBlob(null);
                                            }}
                                            className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-200 border border-red-400/30 hover:border-red-400/50 group"
                                            type="button"
                                        >
                                            <svg
                                                className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area - Scrollable */}
                        <div className="flex-1 px-4 md:px-6 lg:px-8 pb-4 overflow-y-auto">
                            <div className="max-w-6xl mx-auto">
                                {/* Cropper Container */}
                                <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl p-4 md:p-6 lg:p-8 mb-6">
                                    <div className="relative">
                                        {/* Cropper Component */}
                                        <div className="bg-gray-900/50 rounded-2xl p-4 md:p-6 min-h-[300px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center">
                                            <ImageCropper
                                                image={rawImage}
                                                onCropPreview={
                                                    handleCropPreview
                                                }
                                            />
                                        </div>

                                        {/* Crop Instructions - Mobile */}
                                        <div className="mt-4 sm:hidden">
                                            <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-3 border border-blue-400/30">
                                                <p className="text-white/90 text-sm text-center">
                                                    📱 Gunakan dua jari untuk
                                                    zoom dan geser area crop
                                                </p>
                                            </div>
                                        </div>

                                        {/* Crop Instructions - Desktop */}
                                        <div className="mt-4 hidden sm:block">
                                            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                                <div className="flex items-center justify-center gap-6 text-white/90 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                                                            <span className="text-xs">
                                                                🖱️
                                                            </span>
                                                        </div>
                                                        <span>
                                                            Drag untuk memindah
                                                            area
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                                                            <span className="text-xs">
                                                                ⚡
                                                            </span>
                                                        </div>
                                                        <span>
                                                            Scroll untuk zoom
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                                                            <span className="text-xs">
                                                                🎯
                                                            </span>
                                                        </div>
                                                        <span>
                                                            Tarik sudut untuk
                                                            resize
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Preview Result */}
                                {croppedPreview && (
                                    <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl p-4 md:p-6 lg:p-8 mb-6">
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-2 mb-4">
                                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                                    <svg
                                                        className="w-4 h-4 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                </div>
                                                <h3 className="text-white font-semibold text-lg">
                                                    Preview Hasil Crop
                                                </h3>
                                            </div>

                                            <div className="relative inline-block">
                                                <img
                                                    src={croppedPreview}
                                                    alt="Preview Crop"
                                                    className="rounded-2xl border-2 border-white/20 shadow-2xl max-w-full h-48 md:h-64 lg:h-80 object-cover mx-auto"
                                                />
                                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-75 blur-sm -z-10"></div>
                                            </div>

                                            <p className="text-white/70 text-sm mt-3">
                                                Gambar siap untuk disimpan ✨
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons - Fixed at bottom */}
                        <div className="flex-shrink-0 px-4 py-4 md:px-6 lg:px-8">
                            <div className="max-w-6xl mx-auto">
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-4 md:p-6">
                                    {/* Mobile Layout */}
                                    <div className="flex flex-col sm:hidden gap-3">
                                        <button
                                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                                            onClick={handleCropSave}
                                            type="button"
                                            disabled={!croppedBlob}
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <span>Simpan Gambar</span>
                                        </button>

                                        <button
                                            className="w-full py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] border border-white/30 hover:border-white/50 flex items-center justify-center gap-3"
                                            onClick={() => {
                                                setShowCropper(false);
                                                setRawImage(null);
                                                setCroppedPreview(null);
                                                setCroppedBlob(null);
                                            }}
                                            type="button"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                            <span>Batal</span>
                                        </button>
                                    </div>

                                    {/* Desktop Layout */}
                                    <div className="hidden sm:flex items-center justify-between">
                                        <div className="text-white/70 text-sm">
                                            {croppedBlob ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                    <span>
                                                        Gambar siap untuk
                                                        disimpan
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                                    <span>
                                                        Sesuaikan area crop
                                                        terlebih dahulu
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <button
                                                className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 border border-white/30 hover:border-white/50 flex items-center gap-2"
                                                onClick={() => {
                                                    setShowCropper(false);
                                                    setRawImage(null);
                                                    setCroppedPreview(null);
                                                    setCroppedBlob(null);
                                                }}
                                                type="button"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                                <span>Batal</span>
                                            </button>

                                            <button
                                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-xl disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 relative overflow-hidden"
                                                onClick={handleCropSave}
                                                type="button"
                                                disabled={!croppedBlob}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                                <svg
                                                    className="w-5 h-5 relative z-10"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                <span className="relative z-10">
                                                    Simpan Gambar
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
