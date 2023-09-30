<?php

namespace App\Http\Controllers\Api;

use App\Models\Employee;
use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use App\Http\Requests\TaskRequest;
use App\Models\Task;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class EmployeeTaskController extends Controller
{
    /**
     * EmployeeTaskController constructor.
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * @param $employeeId
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request, $employeeId)
    {
        $employee = Employee::findOrFail($employeeId);
        $tasks = QueryBuilder::for(Task::where('employee_id', $employee->employee_id))
            ->allowedFilters([
                'status',
                'start',
                'assembly_number',
                'job.number',
                'area.name',
                'type.name',
                AllowedFilter::scope('started_between')])
            ->allowedIncludes(['area', 'job', 'supervisor', 'type'])
            ->allowedSorts([
                'id',
                'start',
                'assembly_number',
                'status',
                'type.name',
                'area.name',
                'job.number'
            ]);

        $result = $request->has('page') ? $tasks->jsonPaginate(120) : $tasks->get();

        return TaskResource::collection($result);
    }

    /**
     * @param TaskRequest $request
     * @param $employeeId
     * @return TaskResource
     */
    public function store(TaskRequest $request, $employeeId)
    {
        $request['employee_id'] = $employeeId;
        $data = $request->validated();
        $task = Task::create($data);

        return new TaskResource($task);
    }

    /**
     * @param $employeeId
     * @param $taskId
     * @return TaskResource
     */
    public function show($employeeId, $taskId)
    {
        $task = QueryBuilder::for(Task::where('id', $taskId))
            ->allowedIncludes(['area', 'employee', 'job', 'supervisor', 'type'])
            ->firstOrFail();

        return new TaskResource($task);
    }

    /**
     * @param TaskRequest $request
     * @param $employeeId
     * @param $taskId
     * @return TaskResource
     */
    public function update(TaskRequest $request, $employeeId, $taskId)
    {
        $task = Task::findOrFail($taskId);
        $data = $request->validated();
        $update = $task->update($data);

        return new TaskResource($update);
    }

    /**
     * @param $employeeId
     * @param $taskId
     * @return TaskResource
     */
    public function destroy($employeeId, $taskId)
    {
        $task = Task::findOrFail($taskId);
        $task->delete();

        return new TaskResource($task);
    }
}
