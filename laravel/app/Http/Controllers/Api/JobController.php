<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\JobResource;
use App\Models\Job;
use App\Http\Requests\JobRequest;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class JobController extends Controller
{
    /**
     * JobController constructor.
     */
    public function __construct()
    {
        $this->middleware('auth')->except(['index', 'show']);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $jobs = QueryBuilder::for(Job::class)
            ->allowedFilters([
                'number',
                'job_type_id',
                'customer_id',
                'date_created',
                'status',
                'id',
                AllowedFilter::scope('created_between'),
                AllowedFilter::scope('target_completed_between')
            ])
            ->allowedIncludes(['csr', 'tasks', 'customer', 'type'])
            ->allowedSorts(['number', 'date_created', 'status', 'date_target_completion']);

        $result = $request->has('page') ? $jobs->jsonPaginate(120) : $jobs->get();

        return JobResource::collection($result);
    }

    /**
     * @param JobRequest $request
     * @return JobResource
     */
    public function store(JobRequest $request)
    {
        $data = $request->validated();
        $job = Job::create($data);

        return new JobResource($job);
    }

    /**
     * @param $id
     * @return JobResource
     */
    public function show($id)
    {
        $job = QueryBuilder::for(Job::where('id', $id))
            ->allowedIncludes(['csr', 'tasks', 'customer', 'type'])
            ->firstOrFail();

        return new JobResource($job);
    }

    /**
     * @param JobRequest $request
     * @param $id
     * @return JobResource
     */
    public function update(JobRequest $request, $id)
    {
        $job = tap(Job::findOrFail($id))
            ->update($request->validated())
            ->fresh();

        return new JobResource($job);
    }

    /**
     * @param $id
     * @return JobResource
     */
    public function destroy($id)
    {
        $job = Job::findOrFail($id);
        $job->delete();

        return new JobResource($job);
    }

    /**
     * @return mixed
     */
    public function last()
    {
        return Job::latest('created_at')->first();
    }
}
