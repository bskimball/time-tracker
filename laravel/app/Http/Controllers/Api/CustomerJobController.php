<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\JobResource;
use Illuminate\Http\Request;
use MongoDB\Driver\Query;
use Spatie\QueryBuilder\QueryBuilder;

class CustomerJobController extends Controller
{
    /**
     * CustomerJobController constructor.
     */
    public function __construct()
    {
        $this->middleware('auth')->except(['index', 'show']);
    }

    /**
     * @param $id
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index($id)
    {
        $jobs = QueryBuilder::for(Job::where('customer_id', $id))->get();

        return JobResource::collection($jobs);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * @param $customerId
     * @param $jobId
     * @return JobResource
     */
    public function show($customerId, $jobId)
    {
        $job = QueryBuilder::for(Job::where('id', $jobId))->firstOrFail();

        return new JobResource($job);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
