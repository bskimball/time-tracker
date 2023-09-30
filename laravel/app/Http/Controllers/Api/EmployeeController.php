<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\EmployeeRequest;
use App\Http\Requests\JobTypeRequest;
use App\Models\Employee;
use App\Http\Controllers\Controller;
use App\Http\Resources\EmployeeResource;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class EmployeeController extends Controller
{
    /**
     * EmployeeController constructor.
     */
    public function __construct()
    {
        $this->middleware('auth')->except(['index', 'show']);
    }

    /**
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        $employees = QueryBuilder::for(Employee::class)
            ->allowedFilters([
                'department',
                'card_number',
                AllowedFilter::exact('employee_id'),
                AllowedFilter::scope('role')
            ])
            ->allowedSorts([
                'card_number',
                'first_name',
                'last_name'
            ])
            ->get();

        return EmployeeResource::collection($employees);
    }

    /**
     * @param JobTypeRequest $request
     * @return EmployeeResource
     */
    public function store(JobTypeRequest $request)
    {
        $data = $request->validated();
        $employee = Employee::create($data);

        return new EmployeeResource($employee);
    }

    /**
     * @param $id
     * @return EmployeeResource
     */
    public function show($id)
    {
        $employee = QueryBuilder::for(Employee::where('id', $id))->allowedIncludes(['tasks'])->firstOrFail();

        return new EmployeeResource($employee);
    }

    /**
     * @param EmployeeRequest $request
     * @param $id
     * @return EmployeeResource
     */
    public function update(EmployeeRequest $request, $id)
    {
        $employee = tap(Employee::findOrFail($id))
            ->update($request->validated())
            ->fresh();

        return new EmployeeResource($employee);
    }

    /**
     * @param $id
     * @return EmployeeResource
     */
    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);
        $employee->delete();

        return new EmployeeResource($employee);
    }
}
