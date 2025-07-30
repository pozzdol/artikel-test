<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->role === 'admin') {
            // Admin bisa melihat semua artikel
            $articles = Article::with('user')->latest()->get();
        } else {
            // User biasa hanya melihat artikelnya sendiri
            $articles = Article::with('user')
                ->where('user_id', $user->id)
                ->latest()
                ->get();
        }
        return Inertia::render('Articles/Index', ['articles' => $articles]);
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
        $request->validate([
            'title' => 'required',
            'content_html' => 'required',
            'content_json' => 'nullable|json',
        ]);

        $article->update([
            'title' => $request->title,
            'content_html' => $request->content_html,
            'content_json' => $request->content_json,
        ]);

        return redirect()->route('articles.index');
    }

    public function destroy(Article $article)
    {
        $article->delete();
        return redirect()->route('articles.index');
    }
}
