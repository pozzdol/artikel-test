<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'user_id',
        'hero_img',
        'title',
        'content_html',
        'content_json',
        'status',
        'category_id',
        'sub_category_id',
    ];

    /**
     * Get the user that owns the article.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
