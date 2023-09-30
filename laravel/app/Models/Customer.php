<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    public $timestamps = false;

    protected $connection = 'customer';

    protected $table = 'CLLOCN';

    protected $primary = 'CLLOCN_Id';

    protected $appends = ['id', 'name'];

    protected $visible = ['CLLOCN_Id', 'CLLOCN_CompanyName', 'id', 'name'];

    public function getIdAttribute()
    {
        return $this->attributes['CLLOCN_Id'];
    }

    public function getNameAttribute()
    {
        return $this->attributes['CLLOCN_CompanyName'];
    }

    public function jobs()
    {
        return $this->hasMany('App\Models\Job', 'company_id', 'CLLOCN_Id');
    }

    public function scopeName($query, $value)
    {
        return $query->where('CLLOCN_CompanyName', 'like', '%' . $value . '%');
    }
}
