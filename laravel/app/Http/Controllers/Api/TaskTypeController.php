<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskTypeRequest;
use App\Http\Resources\TaskTypeResource;
use App\Models\TaskType;
use Spatie\QueryBuilder\QueryBuilder;

class TaskTypeController extends Controller
{
    /**
     * TaskTypeController constructor.
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
        $taskTypes = QueryBuilder::for(TaskType::class)
            ->allowedSorts(['name'])
            ->get();

        return TaskTypeResource::collection($taskTypes);
    }

    /**
     * @param TaskTypeRequest $request
     * @return TaskTypeResource
     */
    public function store(TaskTypeRequest $request)
    {
        $data = $request->validated();
        $taskType = TaskType::create($data);

        return new TaskTypeResource($taskType);
    }

    /**
     * @param $id
     * @return TaskTypeResource
     */
    public function show($id)
    {
        $taskType = QueryBuilder::for(TaskType::where('id', $id))->firstOrFail();

        return new TaskTypeResource($taskType);
    }

    /**
     * @param TaskTypeRequest $request
     * @param $id
     * @return TaskTypeResource
     */
    public function update(TaskTypeRequest $request, $id)
    {
        $type = tap(TaskType::findOrFail($id))
            ->update($request->validated())
            ->fresh();

        return new TaskTypeResource($type);
    }

    /**
     * @param $id
     * @return TaskTypeResource
     */
    public function destroy($id)
    {
        $taskType = TaskType::findOrFail($id);
        $taskType->delete();

        return new TaskTypeResource($taskType);
    }
}
