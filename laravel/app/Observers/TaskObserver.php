<?php

namespace App\Observers;

use App\Events\TaskCreated;
use App\Events\TaskDeleted;
use App\Events\TaskUpdated;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class TaskObserver
{
    /**
     * @param Task $task
     */
    public function created(Task $task)
    {
        $tasks = Task::where('employee_id', '=', $task->employee_id)
            ->where('id', '!=', $task->id)
            ->get();

        Log::info('task created; stop existing tasks');

        event(new TaskCreated($task->load(['type', 'area', 'employee'])));

        $tasks->each(function ($item) use ($task) {
            if (is_null($item->stop)) {
                $item->update([
                    'stop' => Carbon::now(),
                    'status' => 'Complete',
                    'auto_end' => 'a new task was started'
                ]);
            }
        });
    }

    /**
     * Handle the task "updated" event.
     *
     * @param \App\Task $task
     * @return void
     */
    public function updated(Task $task)
    {
        event(new TaskUpdated($task));
    }

    /**
     * Handle the task "deleted" event.
     *
     * @param \App\Task $task
     * @return void
     */
    public function deleted(Task $task)
    {
        event(new TaskDeleted($task));
    }

    /**
     * Handle the task "restored" event.
     *
     * @param \App\Task $task
     * @return void
     */
    public function restored(Task $task)
    {
        //
    }

    /**
     * Handle the task "force deleted" event.
     *
     * @param \App\Task $task
     * @return void
     */
    public function forceDeleted(Task $task)
    {
        //
    }
}
