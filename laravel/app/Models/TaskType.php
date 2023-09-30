<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskType extends Model
{
    protected $connection = 'timetracker';

    protected $table = 'task_types';

    protected $fillable = [
        'name',
        'description',
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    public function tasks()
    {
        return $this->hasMany('App\Models\Task');
    }
}
