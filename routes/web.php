<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Article routes
    Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
    Route::get('/articles/create', [ArticleController::class, 'create'])->name('articles.create');
    Route::post('/articles', [ArticleController::class, 'store'])->name('articles.store');
    Route::get('/articles/{article}', [ArticleController::class, 'show'])->name('articles.show');
    Route::get('/articles/JDJhJDEyJGxRa0RSTzA3NktTckFEWTRTcnFJai4wZ05aZ2tTbnpQcEx4Ti5xY3FKWnpBR3hiVXdmWnAu/{article}', [ArticleController::class, 'edit'])->name('articles.edit');
    Route::patch('/articles/dXBkYXRl/{article}', [ArticleController::class, 'update'])->name('articles.update');
    Route::delete('/articles/f2a6c498fb90ee345d997f888fce3b18/{article}', [ArticleController::class, 'destroy'])->name('articles.destroy');
});

// API routes
Route::get('/api/articles', [ArticleController::class, 'apiArticles'])->name('articles.api');

require __DIR__ . '/auth.php';
