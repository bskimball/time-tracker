<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $connection = 'timetracker';

    protected $fillable = ['employee_id', 'first_name', 'last_name', 'card_number', 'department'];

    protected $casts = [
        "id" => "integer",
        "employee_id" => "integer",
        "first_name" => "string",
        "last_name" => "string",
        "card_number" => "integer",
        "department" => "string"
    ];

    public function getCardnumberAttribute()
    {
        return $this->attributes['card_number'];
    }

    public function setCardnumber($value)
    {
        $this->attributes['card_number'] = $value;
    }

    public function oldEmployee()
    {
        return $this->hasOne('App\Models\OldEmployee', 'cardnumber', 'card_number');
    }

    public function tasks()
    {
        return $this->hasMany('App\Models\Task', 'employee_id', 'employee_id');
    }

    public function scopeRole($query, $value)
    {
        if ($value == 'csr') {
            return $query->where('department', '!=', 'warehouse');
        }
    }
}
