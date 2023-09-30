<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $connection = 'timetracker';

    protected $table = 'tasks';

    protected $fillable = [
        'record_type',
        'task_type_id',
        'job_id',
        'assembly_number',
        'supervisor_id',
        'employee_id',
        'start',
        'stop',
        'duration',
        'area_id',
        'created_by',
        'updated_by',
        'status',
    ];

    protected $casts = [
        "area_id" => "integer",
        "assembly_number" => "integer",
        "created_by" => "string",
        "duration" => "integer",
        "employee_id" => "integer",
        "id" => "integer",
        "job_id" => "integer",
        "status" => "string",
        "supervisor_id" => "integer",
        "task_type_id" => "integer",
        "updated_by" => "string"
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    protected $appends = [
        'task_length',
        'duration'
    ];

    public function job()
    {
        return $this->belongsTo('App\Models\Job', 'job_id', 'id');
    }

    public function type()
    {
        return $this->belongsTo('App\Models\TaskType', 'task_type_id', 'id');
    }

    public function department()
    {
        return $this->belongsTo('App\Models\Department', 'department_id', 'id');
    }

    public function employee()
    {
        return $this->belongsTo('App\Models\Employee', 'employee_id', 'employee_id');
    }

    public function supervisor()
    {
        return $this->belongsTo('App\Models\Employee', 'supervisor_id', 'employee_id');
    }

    public function area()
    {
        return $this->belongsTo('App\Models\Area', 'area_id', 'id');
    }

    public function getTaskLengthAttribute()
    {
        if ($this->stop == null) {
            $this->stop = Carbon::now();
        }

        $result = strtotime($this->stop) - strtotime($this->start);

        return $result;
    }

    public function getDurationAttribute()
    {
        $stop = is_null($this->attributes['stop']) ? Carbon::now() : Carbon::parse($this->attributes['stop']);
        $start = Carbon::parse($this->attributes['start']);

        return $start->diffInSeconds($stop);
    }

    public function setStatusAttribute()
    {
        if ($this->attributes['stop'] == NULL) {
            $value = 'Active';
        } else {
            $value = 'Complete';
        }
        $this->attributes['status'] = $value;
    }

    public function setStopAttribute($value)
    {
        $this->attributes['stop'] = $value;
        if ($value == null) {
            $this->attributes['status'] = 'Active';
        } else {
            $this->attributes['status'] = 'Complete';
        }
    }

    public function scopeStartedBetween($query, $start, $end)
    {
        $start = Carbon::parse($start)->setHour(0);
        $end = Carbon::parse($end)->setHour(23)->setMinute(59);
        return $query->whereBetween('start', [$start, $end]);
    }
}
