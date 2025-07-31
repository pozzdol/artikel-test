<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;

use App\Models\Article;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->role === 'admin') {
            $articles = Article::leftjoin('users', 'articles.user_id', '=', 'users.id')
                ->select(
                    'articles.id',
                    'articles.title',
                    'articles.content_html',
                    'articles.content_json',
                    'articles.hero_img',
                    'articles.status',
                    'articles.category_id',
                    'articles.sub_category_id',
                    'articles.created_at',
                    'articles.updated_at',
                    'users.name as author_name',
                    'users.img_path as img_path'
                )
                ->latest()->get();
        } else {
            // User biasa hanya melihat artikelnya sendiri
            $articles = Article::where('user_id', $user->id)
                ->leftjoin('users', 'articles.user_id', '=', 'users.id')
                ->select(
                    'articles.id',
                    'articles.title',
                    'articles.content_html',
                    'articles.content_json',
                    'articles.hero_img',
                    'articles.status',
                    'articles.category_id',
                    'articles.sub_category_id',
                    'articles.created_at',
                    'articles.updated_at',
                    'users.name as author_name',
                    'users.img_path as img_path'
                )
                ->latest()->get();
        }
        return Inertia::render('Articles/Index', ['articles' => $articles]);
    }

    public function apiArticles()
    {
        $articles = Article::where('status', 'published')
            ->leftjoin('users', 'articles.user_id', '=', 'users.id')
            ->select(
                'articles.id',
                'articles.title',
                'articles.content_html',
                'articles.content_json',
                'articles.hero_img',
                'articles.status',
                'articles.category_id',
                'articles.sub_category_id',
                'articles.created_at',
                'articles.updated_at',
                'users.name as author_name'
            )
            ->latest()->get();
        return response()->json($articles);
    }

    public function create()
    {
        return Inertia::render('Articles/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content_html' => 'required|string',
            'content_json' => 'nullable|json',
            'hero_img' => 'nullable|image|max:2048',
        ]);

        $userId = auth()->id();
        if (!$userId) {
            abort(403, 'Unauthorized');
        }

        $heroImgPath = null;
        if ($request->hasFile('hero_img')) {
            $heroImgPath = $request->file('hero_img')->store('articles', 'public');
        }

        $article = Article::create([
            'user_id' => $userId,
            'title' => $request->title,
            'content_html' => $request->content_html,
            'content_json' => $request->content_json,
            'hero_img' => $heroImgPath,
        ]);

        return redirect()->route('articles.index');
    }

    public function show(Article $article)
    {
        $article->load('user');
        return Inertia::render('Articles/Show', ['article' => $article]);
    }

    public function edit(Article $article)
    {
        return Inertia::render('Articles/Edit', ['article' => $article]);
    }

    public function update(Request $request, Article $article)
    {
        // return $request->all();
        $request->validate([
            'title' => 'required|string|max:255',
            'content_html' => 'required|string',
            'content_json' => 'nullable|json',
            'hero_img' => 'nullable|image|max:2048',
        ]);


        $data = [
            'title' => $request->title,
            'content_html' => $request->content_html,
            'content_json' => $request->content_json,
        ];

        // Handle hero_img update
        if ($request->hasFile('hero_img')) {
            if ($article->hero_img && Storage::disk('public')->exists($article->hero_img)) {
                Storage::disk('public')->delete($article->hero_img);
            }
            $data['hero_img'] = $request->file('hero_img')->store('articles', 'public');
        }

        $article->update($data);

        return redirect()->route('articles.index');
    }

    public function destroy(Article $article)
    {
        $article->delete();
        return redirect()->route('articles.index');
    }
}
