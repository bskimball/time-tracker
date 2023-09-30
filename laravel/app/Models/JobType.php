<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobType extends Model
{
    protected $connection = 'timetracker';

    protected $table = 'job_types';

//    protected $dateFormat = 'Y-m-d H:i:s';

    protected $fillable = [
        'name',
        'description'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    public function jobs()
    {
        return $this->hasMany('App\Models\Job');
    }
}
