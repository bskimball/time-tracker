<?php

namespace App\Http\Controllers\Api;

use App\Models\Department;
use App\Http\Controllers\Controller;
use App\Http\Resources\DepartmentResource;
use App\Http\Requests\DepartmentRequest;
use Spatie\QueryBuilder\QueryBuilder;

class DepartmentController extends Controller
{
    /**
     * DepartmentController constructor.
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
        $departments = QueryBuilder::for(Department::class)
            ->allowedSorts(['name', 'description'])
            ->get();

        return DepartmentResource::collection($departments);
    }

    /**
     * @param DepartmentRequest $request
     * @return DepartmentResource
     */
    public function store(DepartmentRequest $request)
    {
        $data = $request->validated();

        $department = Department::create($data);

        return new DepartmentResource($department);
    }

    /**
     * @param $id
     * @return DepartmentResource
     */
    public function show($id)
    {
        $department = QueryBuilder::for(Department::where('id', $id))->firstOrFail();

        return new DepartmentResource($department);
    }

    /**
     * @param DepartmentRequest $request
     * @param $id
     * @return DepartmentResource
     */
    public function update(DepartmentRequest $request, $id)
    {
        $department = Department::findOrFail($id);
        $data = $request->validated();
        $update = $department->update($data);

        return new DepartmentResource($update);
    }

    /**
     * @param $id
     * @return DepartmentResource
     */
    public function destroy($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();

        return new DepartmentResource($department);
    }
}
