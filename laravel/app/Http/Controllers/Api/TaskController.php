<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use App\Http\Requests\TaskRequest;
use App\Models\Task;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class TaskController extends Controller
{
    /**
     * TaskController constructor.
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show', 'store']);
        $this->middleware('throttle:tasks');
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $tasks = QueryBuilder::for(Task::class)
            ->allowedFilters([
                'status',
                'start',
                'assembly_number',
                'job.number',
                'area.name',
                'type.name',
                AllowedFilter::exact('employee.card_number'),
                AllowedFilter::exact('employee_id'),
                AllowedFilter::scope('started_between')])
            ->allowedIncludes(['area', 'employee', 'job', 'supervisor', 'type'])
            ->allowedSorts([
                'id',
                'start',
                'assembly_number',
                'status',
                'type.name',
                'area.name',
                'employee.card_number',
                'job.number'
            ]);

        $result = $request->has('page') ? $tasks->jsonPaginate(120) : $tasks->get();

        return TaskResource::collection($result);
    }

    /**
     * @param TaskRequest $request
     * @return TaskResource
     */
    public function store(TaskRequest $request)
    {
        $data = $request->validated();
        $task = Task::create($data);

        return new TaskResource($task);
    }

    /**
     * @param $id
     * @return TaskResource
     */
    public function show($id)
    {
        $task = QueryBuilder::for(Task::where('id', $id))->allowedIncludes(['area', 'employee', 'job', 'supervisor', 'type'])->firstOrFail();

        return new TaskResource($task);
    }

    /**
     * @param TaskRequest $request
     * @param $id
     * @return TaskResource
     */
    public function update(TaskRequest $request, $id)
    {
        $task = tap(Task::findOrFail($id))
            ->update($request->validated())
            ->fresh();

        return new TaskResource($task);
    }

    /**
     * @param $id
     * @return TaskResource
     */
    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();

        return new TaskResource($task);
    }
}
