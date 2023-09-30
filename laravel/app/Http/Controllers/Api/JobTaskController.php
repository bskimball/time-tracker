<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Http\Request;

class JobTaskController extends Controller
{
    /**
     * JobTaskController constructor.
     */
    public function __construct()
    {
        $this->middleware('auth')->except(['index', 'show', 'count']);
    }

    /**
     * @param Request $request
     * @param $jobId
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request, $jobId)
    {
        $tasks = QueryBuilder::for(Task::where('job_id', $jobId))
            ->allowedFilters([
                'status',
                'start',
                'assembly_number',
                'job.number',
                'area.name',
                'type.name',
                AllowedFilter::exact('employee.card_number'),
                AllowedFilter::scope('started_between')])
            ->allowedIncludes(['area', 'employee', 'job', 'supervisor', 'type'])
            ->allowedSorts(['id', 'start', 'assembly_number', 'status', 'type.name', 'area.name', 'employee.card_number', 'job.number']);

        $result = $request->has('page') ? $tasks->jsonPaginate(120) : $tasks->get();

        return TaskResource::collection($result);
    }

    /**
     * @param JobTaskRequest $request
     * @param $jobId
     * @return TaskResource|void
     */
    public function store(JobTaskRequest $request, $jobId)
    {
        $data = $request->validated();
        $task = Task::create(array_merge($data, ['job_id' => $jobId]));

        return new TaskResource($task);
    }

    /**
     * @param $jobId
     * @param $taskId
     * @return TaskResource
     */
    public function show($jobId, $taskId)
    {
        $task = QueryBuilder::for(Task::where('id', $taskId))->firstOrFail();

        return new TaskResource($task);
    }

    /**
     * @param JobTaskRequest $request
     * @param $jobId
     * @param $taskId
     * @return TaskResource
     */
    public function update(JobTaskRequest $request, $jobId, $taskId)
    {
        $task = Task::findOrFail($taskId);
        $data = $request->validated();
        $update = $task->update($data);

        return new TaskResource($update);
    }

    /**
     * @param $jobId
     * @param $taskId
     * @return TaskResource
     */
    public function destroy($jobId, $taskId)
    {
        $task = Task::findOrFail($taskId);
        $task->delete();

        return new TaskResource($task);
    }

    public function count($jobId)
    {
        return Task::where('job_id', $jobId)->get()->count();
    }
}
