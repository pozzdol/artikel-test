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
            $table->string('category_id')->nullable()->after('status');
            $table->string('sub_category_id')->nullable()->after('category_id');
        });
    }

    public function down()
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn(['category_id', 'sub_category_id']);
        });
    }
};
