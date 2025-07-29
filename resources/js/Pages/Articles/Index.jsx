import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Index({ articles }) {
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

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
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
                                        Buat Artikel Pertama
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {articles.map((article, index) => (
                                        <article
                                            key={article.id}
                                            className="group bg-white/60 backdrop-blur-sm rounded-2xl shadow hover:bg-white/80 hover:shadow-xl transition-all duration-500 border border-white/20 flex flex-col h-full overflow-hidden"
                                            style={{
                                                animationDelay: `${
                                                    index * 100
                                                }ms`,
                                                animation:
                                                    "fadeInUp 0.6s ease-out forwards",
                                            }}
                                        >
                                            {/* Hero Image with Overlay Effects */}
                                            {article.hero_img && (
                                                <Link
                                                    href={`/articles/${article.id}`}
                                                    className="block relative overflow-hidden"
                                                >
                                                    <div className="relative h-48 overflow-hidden">
                                                        <img
                                                            src={`/storage/${article.hero_img}`}
                                                            alt="Hero"
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                                        />
                                                        {/* Gradient Overlay */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                        {/* Action Buttons Overlay */}
                                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                                            <Link
                                                                href={`/articles/${article.id}/edit`}
                                                                className="bg-white/90 hover:bg-white text-gray-700 hover:text-yellow-600 p-2 rounded-lg backdrop-blur-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
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
                                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                    />
                                                                </svg>
                                                            </Link>
                                                            <Link
                                                                href={`/articles/${article.id}`}
                                                                method="delete"
                                                                as="button"
                                                                className="bg-red-500/90 hover:bg-red-500 text-white p-2 rounded-lg backdrop-blur-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    if (
                                                                        !confirm(
                                                                            "Apakah Anda yakin ingin menghapus artikel ini?"
                                                                        )
                                                                    ) {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
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
                                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                    />
                                                                </svg>
                                                            </Link>
                                                        </div>

                                                        {/* Reading Time Badge */}
                                                        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                                            <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                                                                5 min read
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )}

                                            {/* Content Section */}
                                            <div className="flex-1 flex flex-col p-6">
                                                {/* Header with Title */}
                                                <div className="mb-4">
                                                    <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 leading-tight line-clamp-2 transition-colors duration-300 group-hover:text-blue-600">
                                                        <Link
                                                            href={`/articles/${article.id}`}
                                                            className="hover:underline decoration-2 underline-offset-2"
                                                        >
                                                            {article.title}
                                                        </Link>
                                                    </h2>
                                                </div>

                                                {/* Author and Date Info */}
                                                {article.user && (
                                                    <div className="flex items-center gap-3 mb-4">
                                                        {/* Author Avatar Placeholder */}
                                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                            {article.user.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-700">
                                                                {
                                                                    article.user
                                                                        .name
                                                                }
                                                            </p>
                                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                <svg
                                                                    className="w-3 h-3"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                                <span>
                                                                    {new Date(
                                                                        article.created_at
                                                                    ).toLocaleDateString(
                                                                        "id-ID",
                                                                        {
                                                                            year: "numeric",
                                                                            month: "long",
                                                                            day: "numeric",
                                                                        }
                                                                    )}{" "}
                                                                    {new Date(
                                                                        article.created_at
                                                                    ).toLocaleTimeString(
                                                                        "id-ID",
                                                                        {
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                            hour12: false,
                                                                            timeZone:
                                                                                "Asia/Jakarta",
                                                                        }
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Article Excerpt */}
                                                <div className="flex-1 mb-4">
                                                    <div
                                                        className="prose prose-sm max-w-none text-gray-600 line-clamp-3 leading-relaxed"
                                                        dangerouslySetInnerHTML={{
                                                            __html: article.content_html,
                                                        }}
                                                    />
                                                </div>

                                                {/* Tags Placeholder */}
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                                        Technology
                                                    </span>
                                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                                        Tutorial
                                                    </span>
                                                </div>

                                                {/* Read More Section */}
                                                <div className="mt-auto pt-4 border-t border-gray-100">
                                                    <div className="flex items-center justify-between">
                                                        <Link
                                                            href={`/articles/${article.id}`}
                                                            className="group/btn inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-all duration-300"
                                                        >
                                                            <span>
                                                                Baca
                                                                selengkapnya
                                                            </span>
                                                            <svg
                                                                className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                                                />
                                                            </svg>
                                                        </Link>

                                                        {/* Quick Actions */}
                                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                            <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors duration-200">
                                                                <svg
                                                                    className="w-4 h-4"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            </button>
                                                            <button className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors duration-200">
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
                                                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Decorative Element */}
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
