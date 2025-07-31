import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Archive,
    Eye,
    LucideSquareArrowOutUpRight,
    MessageSquare,
    MoreVertical,
    Send,
    Share,
    Share2,
    SquareArrowOutUpRight,
    SquarePen,
    Tag,
    Tags,
    ThumbsUp,
    Trash,
} from "lucide-react";
import React from "react";

export default function Index({ articles }) {
    const [openDropdown, setOpenDropdown] = React.useState(null);
    const [dropdownPosition, setDropdownPosition] = React.useState("bottom");

    // Helper to handle dropdown placement
    const handleDropdownOpen = (e, articleId) => {
        const buttonRect = e.currentTarget.getBoundingClientRect();
        const dropdownHeight = 200; // estimate dropdown height (px)
        const spaceBelow = window.innerHeight - buttonRect.bottom;
        if (spaceBelow < dropdownHeight) {
            setDropdownPosition("top");
        } else {
            setDropdownPosition("bottom");
        }
        setOpenDropdown(articleId);
    };

    function share(article) {
        if (navigator.share) {
            navigator
                .share({
                    title: article.title,
                    text: "Cek artikel ini!",
                    url: window.location.origin + "/articles/" + article.id,
                })
                .then()
                .catch();
        } else {
            alert("Fitur share tidak didukung di browser ini.");
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Daftar Artikel
                    </h2>
                    <Link
                        href="/articles/create"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                        Buat Artikel Baru
                    </Link>
                </div>
            }
        >
            <Head title="Daftar Artikel" />

            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 overflow-hidden">
                <div className="p-6 text-gray-900">
                    {articles.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">
                                Belum ada artikel yang dibuat.
                            </p>
                            <Link
                                href="/articles/create"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
                            >
                                Buat Artikel Pertamamu
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {articles.map((article, index) => (
                                <div
                                    className="bg-white rounded-lg p-4 lg:py-2 lg:px-6 flex flex-col lg:flex-row group lg:items-center shadow-sm"
                                    key={article.id}
                                >
                                    {/* Mobile Layout */}
                                    <div className="lg:hidden">
                                        {/* Header with image and title */}
                                        <div className="flex gap-3 mb-3">
                                            {article.hero_img && (
                                                <div className="overflow-hidden w-20 h-14 rounded flex-shrink-0">
                                                    <img
                                                        src={`/storage/${article.hero_img}`}
                                                        alt="Hero"
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <a className="text-base font-semibold text-gray-800 hover:text-blue-600 hover:underline cursor-pointer transition-colors duration-200 line-clamp-2 block">
                                                    {article.title}
                                                </a>
                                            </div>
                                        </div>

                                        {/* Status and Date */}
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    article.status === "draft"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}
                                            >
                                                {article.status === "draft"
                                                    ? "Draft"
                                                    : "Published"}
                                            </span>
                                            <span className="text-gray-300">
                                                •
                                            </span>
                                            <time className="text-gray-600 text-xs">
                                                {new Date(
                                                    article.created_at
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                                <span className="text-gray-300">
                                                    •
                                                </span>
                                                {new Date(
                                                    article.created_at
                                                ).toLocaleTimeString("id-ID", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </time>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                                            <div className="flex items-center gap-1">
                                                <Tag
                                                    size={14}
                                                    className="text-blue-500"
                                                />
                                                <span>Blog</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Tags
                                                    size={14}
                                                    className="text-purple-500"
                                                />
                                                <span className="truncate">
                                                    Teknologi, Berita
                                                </span>
                                            </div>
                                        </div>

                                        {/* Bottom section with user and actions */}
                                        <div className="flex items-center justify-between">
                                            {/* User info */}
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={
                                                        article.img_path ||
                                                        `https://avatar.iran.liara.run/public?seed=${article.author_name}`
                                                    }
                                                    alt=""
                                                    className="w-6 h-6 rounded-full"
                                                />
                                                <span className="text-sm text-gray-600 max-w-32 md:max-w-48 truncate">
                                                    {article.author_name}
                                                </span>
                                            </div>

                                            {/* Stats and actions */}
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1 text-gray-600 text-xs">
                                                    0
                                                    <MessageSquare size={14} />
                                                </div>
                                                <div className="flex items-center gap-1 text-gray-600 text-xs">
                                                    0
                                                    <ThumbsUp size={14} />
                                                </div>
                                                {article.status === "draft" ? (
                                                    <></>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            share(article)
                                                        }
                                                        title="Share"
                                                        className="p-1.5 rounded-full hover:bg-gray-200 bg-gray-100 transition-all duration-200"
                                                    >
                                                        <Share2 size={14} />
                                                    </button>
                                                )}
                                                {/* Action menu for mobile */}
                                                <div className="relative">
                                                    {/* Tombol trigger dropdown */}
                                                    <button
                                                        className="p-1.5 rounded-full hover:bg-gray-200 bg-gray-100 transition-all duration-200"
                                                        onClick={(e) =>
                                                            openDropdown ===
                                                            article.id
                                                                ? setOpenDropdown(
                                                                      null
                                                                  )
                                                                : handleDropdownOpen(
                                                                      e,
                                                                      article.id
                                                                  )
                                                        }
                                                        type="button"
                                                    >
                                                        <MoreVertical
                                                            size={14}
                                                        />
                                                    </button>
                                                    {/* Dropdown menu */}
                                                    {openDropdown ===
                                                        article.id && (
                                                        <div
                                                            className={`absolute right-0 z-10 w-40 bg-white border border-gray-200 rounded shadow-lg flex flex-col animate-fade-in
                                                            ${
                                                                dropdownPosition ===
                                                                "top"
                                                                    ? "bottom-full mb-2"
                                                                    : "mt-2 top-full"
                                                            }
                                                        `}
                                                            onMouseLeave={() =>
                                                                setOpenDropdown(
                                                                    null
                                                                )
                                                            }
                                                        >
                                                            {article.status ===
                                                            "draft" ? (
                                                                <>
                                                                    <Link
                                                                        title="Preview"
                                                                        href={`/articles/${article.id}/preview`}
                                                                        className="flex items-center gap-2 px-4 py-2 text-sky-600 hover:bg-sky-50 transition-all duration-200"
                                                                    >
                                                                        <Eye
                                                                            size={
                                                                                16
                                                                            }
                                                                        />{" "}
                                                                        Preview
                                                                    </Link>
                                                                    <Link
                                                                        title="Publish"
                                                                        href={`/articles/${article.id}/publish`}
                                                                        className="flex items-center gap-2 px-4 py-2 text-amber-600 hover:bg-amber-50 transition-all duration-200"
                                                                    >
                                                                        <Send
                                                                            size={
                                                                                16
                                                                            }
                                                                        />{" "}
                                                                        Publish
                                                                    </Link>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Link
                                                                        title="View Article"
                                                                        href={`/articles/${article.id}`}
                                                                        className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                                                                    >
                                                                        <LucideSquareArrowOutUpRight
                                                                            size={
                                                                                16
                                                                            }
                                                                        />{" "}
                                                                        Lihat
                                                                    </Link>
                                                                    <Link
                                                                        title="Set to draft"
                                                                        href={`/articles/${article.id}/draft`}
                                                                        className="flex items-center gap-2 px-4 py-2 text-amber-600 hover:bg-amber-50 transition-all duration-200"
                                                                    >
                                                                        <Archive
                                                                            size={
                                                                                16
                                                                            }
                                                                        />{" "}
                                                                        Set to
                                                                        draft
                                                                    </Link>
                                                                </>
                                                            )}
                                                            <Link
                                                                title="Edit Article"
                                                                href={route(
                                                                    "articles.edit",
                                                                    article
                                                                )}
                                                                className="flex items-center gap-2 px-4 py-2 text-sky-600 hover:bg-sky-50 transition-all duration-200"
                                                            >
                                                                <SquarePen
                                                                    size={16}
                                                                />{" "}
                                                                Edit
                                                            </Link>
                                                            <Link
                                                                href={route(
                                                                    "articles.destroy",
                                                                    article.id
                                                                )}
                                                                method="delete"
                                                                as="button"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    if (
                                                                        !confirm(
                                                                            "Yakin hapus artikel ini?"
                                                                        )
                                                                    )
                                                                        e.preventDefault();
                                                                }}
                                                                className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 transition-all duration-200"
                                                            >
                                                                <Trash
                                                                    size={16}
                                                                />{" "}
                                                                Hapus
                                                            </Link>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop Layout (hidden on mobile) */}
                                    <div className="hidden lg:contents">
                                        {article.hero_img && (
                                            <div className="overflow-hidden w-[142px] h-[80px] rounded flex-shrink-0">
                                                <img
                                                    src={`/storage/${article.hero_img}`}
                                                    alt="Hero"
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                />
                                            </div>
                                        )}
                                        <div className="ms-4 grid grid-rows-3 flex-1 min-w-0">
                                            {/* Title */}
                                            <a className="text-lg w-fit max-w-[250px] md:max-w-full truncate font-semibold text-gray-800 hover:text-blue-600 hover:underline cursor-pointer transition-colors duration-200 line-clamp-2">
                                                {article.title}
                                            </a>

                                            {/* Status and Date */}
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        article.status ===
                                                        "draft"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-green-100 text-green-700"
                                                    }`}
                                                >
                                                    {article.status === "draft"
                                                        ? "Draft"
                                                        : "Published"}
                                                </span>
                                                <span className="text-gray-300">
                                                    •
                                                </span>
                                                <time className="text-gray-600">
                                                    {new Date(
                                                        article.created_at
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </time>
                                            </div>

                                            {/* Tags */}
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Tag
                                                        size={16}
                                                        className="text-blue-500"
                                                    />
                                                    <span>Blog</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Tags
                                                        size={16}
                                                        className="text-purple-500"
                                                    />
                                                    <span>
                                                        Teknologi, Berita
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ms-auto flex flex-col items-end">
                                            <div className="">
                                                <div className="hidden group-hover:flex gap-2 mb-1 transition-all duration-200">
                                                    {article.status ===
                                                    "draft" ? (
                                                        <>
                                                            <Link
                                                                title="Preview"
                                                                href={`/articles/${article.id}/preview`}
                                                                className="text-sky-600 cursor-pointer bg-sky-100 hover:bg-sky-200 p-2 rounded-full transition-all duration-200"
                                                            >
                                                                <Eye
                                                                    size={16}
                                                                />
                                                            </Link>
                                                            <Link
                                                                title="Publish"
                                                                href={`/articles/${article.id}/publish`}
                                                                className="text-amber-600 cursor-pointer bg-amber-100 hover:bg-amber-200 p-2 rounded-full transition-all duration-200"
                                                            >
                                                                <Send
                                                                    size={16}
                                                                />
                                                            </Link>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Link
                                                                title="View Article"
                                                                href={`/articles/${article.id}`}
                                                                className="text-emerald-600 cursor-pointer bg-emerald-100 hover:bg-emerald-200 p-2 rounded-full transition-all duration-200"
                                                            >
                                                                <LucideSquareArrowOutUpRight
                                                                    size={16}
                                                                />
                                                            </Link>
                                                            <Link
                                                                title="Archive Article"
                                                                href={`/articles/${article.id}/archive`}
                                                                className="text-amber-600 cursor-pointer bg-amber-100 hover:bg-amber-200 p-2 rounded-full transition-all duration-200"
                                                            >
                                                                <Archive
                                                                    size={16}
                                                                />
                                                            </Link>
                                                        </>
                                                    )}
                                                    <Link
                                                        title="Edit Article"
                                                        href={route(
                                                            "articles.edit",
                                                            article
                                                        )}
                                                        className="text-sky-600 cursor-pointer bg-sky-100 hover:bg-sky-200 p-2 rounded-full transition-all duration-200"
                                                    >
                                                        <SquarePen size={16} />
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            "articles.destroy",
                                                            article.id
                                                        )}
                                                        method="delete"
                                                        as="button"
                                                        onClick={(e) => {
                                                            if (
                                                                !confirm(
                                                                    "Yakin hapus artikel ini?"
                                                                )
                                                            )
                                                                e.preventDefault();
                                                        }}
                                                        className="text-rose-600 cursor-pointer bg-rose-100 hover:bg-rose-200 p-2 rounded-full transition-all duration-200"
                                                    >
                                                        <Trash size={16} />
                                                    </Link>
                                                </div>
                                                <div className="flex group-hover:hidden items-center transition-all duration-200">
                                                    <p className="truncate md:max-w-52 max-w-10 text-base">
                                                        {article.author_name}
                                                    </p>
                                                    <img
                                                        src={
                                                            article.img_path ||
                                                            `https://avatar.iran.liara.run/public?seed=${article.author_name}`
                                                        }
                                                        alt=""
                                                        className="w-8 h-8 rounded-full ms-2"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                {article.status === "draft" ? (
                                                    <></>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            share(article)
                                                        }
                                                        title="Share"
                                                        className="p-2 rounded-full hover:bg-gray-200 bg-gray-100 transition-all duration-200"
                                                    >
                                                        <Share2 size={16} />
                                                    </button>
                                                )}
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    0
                                                    <MessageSquare size={16} />
                                                </div>
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    0
                                                    <ThumbsUp size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
