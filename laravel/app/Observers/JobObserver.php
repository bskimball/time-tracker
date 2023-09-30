<?php

namespace App\Observers;

use App\Events\JobCreated;
use App\Events\JobDeleted;
use App\Events\JobUpdated;
use App\Models\Job;
use Illuminate\Support\Facades\Log;

class JobObserver
{
    /**
     * Handle the Job "created" event.
     *
     * @param \App\Models\Job $job
     * @return void
     */
    public function created(Job $job)
    {
        Log::info('Job created');
        event(new JobCreated($job));
    }

    /**
     * Handle the Job "updated" event.
     *
     * @param \App\Models\Job $job
     * @return void
     */
    public function updated(Job $job)
    {
        event(new JobUpdated($job));
    }

    /**
     * Handle the Job "deleted" event.
     *
     * @param \App\Models\Job $job
     * @return void
     */
    public function deleted(Job $job)
    {
        event(new JobDeleted($job));
    }

    /**
     * Handle the Job "restored" event.
     *
     * @param \App\Models\Job $job
     * @return void
     */
    public function restored(Job $job)
    {
        //
    }

    /**
     * Handle the Job "force deleted" event.
     *
     * @param \App\Models\Job $job
     * @return void
     */
    public function forceDeleted(Job $job)
    {
        //
    }
}
