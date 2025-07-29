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
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
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
                                <div className="space-y-6">
                                    {articles.map((article) => (
                                        <article
                                            key={article.id}
                                            className="border-b border-gray-200 pb-6 last:border-b-0"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                                                    <Link
                                                        href={`/articles/${article.id}`}
                                                    >
                                                        {article.title}
                                                    </Link>
                                                </h2>
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/articles/${article.id}/edit`}
                                                        className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <Link
                                                        href={`/articles/${article.id}`}
                                                        method="delete"
                                                        as="button"
                                                        className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                                                        onClick={(e) => {
                                                            if (
                                                                !confirm(
                                                                    "Apakah Anda yakin ingin menghapus artikel ini?"
                                                                )
                                                            ) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    >
                                                        Hapus
                                                    </Link>
                                                </div>
                                            </div>

                                            {article.user && (
                                                <p className="text-sm text-gray-600 mb-3">
                                                    Oleh: {article.user.name} •{" "}
                                                    {new Date(
                                                        article.created_at
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                </p>
                                            )}

                                            <div
                                                className="prose prose-sm max-w-none text-gray-700"
                                                dangerouslySetInnerHTML={{
                                                    __html: article.content_html,
                                                }}
                                            />

                                            <div className="mt-3">
                                                <Link
                                                    href={`/articles/${article.id}`}
                                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                                >
                                                    Baca selengkapnya →
                                                </Link>
                                            </div>
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
