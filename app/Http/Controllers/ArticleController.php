<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function index()
    {
        $id_user = auth()->id();

        $articles = Article::with('user')
            ->where('user_id', $id_user)
            ->latest()
            ->get();
        return Inertia::render('Articles/Index', ['articles' => $articles]);
    }

    public function create()
    {
        return Inertia::render('Articles/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'content_html' => 'required',
            'content_json' => 'nullable|json',
        ]);

        $article = Article::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'content_html' => $request->content_html,
            'content_json' => $request->content_json,
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
