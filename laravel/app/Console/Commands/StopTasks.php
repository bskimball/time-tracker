<?php
/**
 * Created by PhpStorm.
 * User: Brian S Kimball
 * Date: 6/8/2018
 * Time: 3:45 PM
 */

namespace App\Console\Commands;

use App\Repository\SolvedRepository;
use App\Task;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class StopTasks extends Command
{
    protected $signature = 'stop_tasks';

    protected $description = 'Stop any active task';

    private function getActiveTasks()
    {
        return Task::where('status', '=', 'Active')->get();
    }

    private function getTimecardResults($employee_id)
    {
        $solved = new SolvedRepository();
        return $solved->getTimecardResults($employee_id);
    }

    private function getLatestPunchOut($results) {
        $latest = Carbon::today();
        foreach ($results as $result) {
            $endTime = Carbon::parse($result->resultEndDateTime);
            if ($endTime->greaterThan($latest)) {
                $latest = $endTime;
            }
        }
        return $latest;
    }

    private function stopTaskIfPunchedOut($task)
    {
        Log::info("employee_id: " . $task->employee_id);
        $timecardResults = $this->getTimecardResults($task->employee_id);
        if (count($timecardResults) < 1) {
            $task->stop = Carbon::create(null, null, null, 18, 0, 0, 'America/New_York');
        } else {
            $latest = $this->getLatestPunchOut($timecardResults);
            if ($latest->greaterThan($task->start)) {
                Log::info("setting stop time: " . $latest . " for task: " . $task->id);
                $task->stop = $latest;
            } else {
                Log::info("setting stop time: 16:00:00 for task: " . $task->id);
                $task->stop = Carbon::create(null, null, null, 18, 0, 0, 'America/New_York');
            }
        }
        $task->status = 'Complete';
        $task->updated_by = 'nightly auto end';
        $task->auto_end = 'yes';
        $task->save();
    }

    private function stopTasksAtSix($task)
    {
        $task->stop = Carbon::create(null, null, null, 18, 0, 0, 'America/New_York');
        $task->status = 'Complete';
        $task->updated_by = 'nightly auto end';
        $task->auto_end = 'yes';
        $task->save();
    }

    public function handle()
    {
        Log::info('starting stop_tasks command');
        $tasks = $this->getActiveTasks();
        if ($tasks) {
            Log::info('there are active tasks');
            foreach ($tasks as $task) {
                Log::info('employee_id: ' . $task->employee_id . ' has an active task: ' . $task);
                $this->stopTaskIfPunchedOut($task);
                Log::info('break');
            }
        } else {
            Log::info('there are not any active tasks');
        }
    }
}