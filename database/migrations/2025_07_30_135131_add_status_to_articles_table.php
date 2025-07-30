<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->enum('status', ['draft', 'published'])->default('draft')->after('hero_img');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
