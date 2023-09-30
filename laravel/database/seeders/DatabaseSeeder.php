<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        DB::table("users")->insert([
            'name' => 'bskimball',
            'email' => 'brian.kimball@bdkonline.com',
            'password' => Hash::make('br1@nR@v3n'),
            'role' => 'developer',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
    }
}
