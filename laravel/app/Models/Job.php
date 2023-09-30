<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    protected $connection = 'timetracker';

    protected $table = 'jobs';

//    protected $dateFormat = 'Y-m-d H:i:s';

    protected $fillable = [
        'number',
        'job_type_id',
        'csr_id',
        'customer_id',
        'date_created',
        'date_target_completion',
        'date_released_to_production',
        'date_completed',
        'date_billed',
        'date_closed',
        'pieces_estimated',
        'pieces_actual',
        'status',
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    public function type()
    {
        return $this->belongsTo('App\Models\JobType', 'job_type_id', 'id');
    }

    public function tasks()
    {
        return $this->hasMany('App\Models\Task', 'job_id');
    }

    public function customer()
    {
        return $this->belongsTo('App\Models\Customer', 'customer_id', 'CLLOCN_Id')->select('CLLOCN_Id', 'CLLOCN_CompanyName');
    }

    public function csr()
    {
        return $this->belongsTo('App\Models\Employee', 'csr_id', 'employee_id');
    }

    public function scopeStatus($query, $type)
    {
        return $query->where('status', $type);
    }

    public function scopeSearch($query, $term)
    {
        return $query->whereLike(['number', 'customer.name'], $term);
    }

    public function scopeCreatedBetween($query, $start, $end)
    {
        $start = Carbon::parse($start)->setHour(0);
        $end = Carbon::parse($end)->setHour(23)->setMinute(59);
        return $query->whereBetween('date_created', [$start, $end]);
    }

    public function scopeTargetCompletedBetween($query, $start, $end)
    {
        $start = Carbon::parse($start)->setHour(0);
        $end = Carbon::parse($end)->setHour(23)->setMinute(59);
        return $query->whereBetween('date_target_completion', [$start, $end]);
    }
}
