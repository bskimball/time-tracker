<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobTypeRequest;
use App\Http\Resources\JobTypeResource;
use App\Models\JobType;
use Spatie\QueryBuilder\QueryBuilder;

class JobTypeController extends Controller
{
    /**
     * JobTypeController constructor.
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
        $jobTypes = QueryBuilder::for(JobType::class)
            ->allowedSorts(['name'])
            ->get();

        return JobTypeResource::collection($jobTypes);
    }

    /**
     * @param JobTypeRequest $request
     * @return JobTypeResource
     */
    public function store(JobTypeRequest $request)
    {
        $data = $request->validated();
        $jobType = JobType::create($data);

        return new JobTypeResource($jobType);
    }

    /**
     * @param $id
     * @return JobTypeResource
     */
    public function show($id)
    {
        $jobType = QueryBuilder::for(JobType::where('id', $id))->firstOrFail();

        return new JobTypeResource($jobType);
    }

    /**
     * @param JobTypeRequest $request
     * @param $id
     * @return JobTypeResource
     */
    public function update(JobTypeRequest $request, $id)
    {
        $type = tap(JobType::findOrFail($id))
            ->update($request->validated())
            ->fresh();

        return new JobTypeResource($type);
    }

    /**
     * @param $id
     * @return JobTypeResource
     */
    public function destroy($id)
    {
        $jobType = JobType::findOrFail($id);
        $jobType->delete();

        return new JobTypeResource($jobType);
    }
}
