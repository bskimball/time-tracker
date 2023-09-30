<?php

namespace App\Console\Commands;

use App\OldEmployee;
use App\Task;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ConvertEmployees extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'convert:employees';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Convert the Employee Id from the Old Table';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     *
     */
    public function handle()
    {
        $tasks = Task::where('created_at', '>', Carbon::create('2020', '05', '02'))->get();

        $tasks->each(function ($task) {
            $old = OldEmployee::find($task->employee_id);
            if ($old) {
                $current = $old->currentEmployee;
                if ($current) {
                    Log::info('task: ' . $task->id . ' is updated');
                    $task->update(['employee_id' => $current->employee_id]);
                } else {
                    Log::error('card number: ' . $old->cardnumber . ' does not exist in the new table');
                }
            }
        });
    }
}
