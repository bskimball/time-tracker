<?php
/**
 * Created by PhpStorm.
 * User: Brian S Kimball
 * Date: 4/5/2018
 * Time: 11:30 AM
 */

namespace App\Repository;

use App\Task;
use Carbon\Carbon;

class TaskRepository
{
    public function getTasksByEmployee($employee_id)
    {
        $tasks = Task::where('employee_id', '=', $employee_id)->get();

        return $tasks;
    }

    public function stopPreviousTasks($tasks)
    {
        $stopped_tasks = [];
        foreach ($tasks as $task) {
            if (is_null($task->stop)) {
                $task->stop = Carbon::now();
                $task->status = 'Complete';
                $task->auto_end = 'a new task was started';
                $task->save();
                $stopped = Task::find($task->id);
                array_push($stopped_tasks, $stopped);
            }
        }
        return $stopped_tasks;
    }

    public function getTasksByDate($date, $tasks = null) {
        if (is_null($tasks)) {
            $tasks = Task::orderBy('created_at', 'DESC');
        }
        $dt = Carbon::createFromFormat('Y-m-d H', $date . ' 0');
        $day_after = new \DateTime($dt->addDay());
        $day_before = new \DateTime($dt->subDay());

        return $tasks->whereBetween('created_at', [$day_before, $day_after]);
    }
}