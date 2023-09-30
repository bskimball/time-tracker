<?php

namespace App\Console\Commands;

use App\Employee;
use App\Repository\SolvedRepository;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SyncEmployees extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync_employees';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Syncs Employees with iSolved';

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
     * @param SolvedRepository $solved
     */
    public function handle(SolvedRepository $solved)
    {
        Log::info('Sync Employees begins');
        $solvedEmployees = collect($solved->getEmployees());
        $myEmployees = Employee::all();

        // check each iSolved employee and update the record in case of a change
        // if it doesn't exist then create a new record
        $solvedEmployees->each(function ($se) {
            $employee = Employee::updateOrCreate(['employee_id' => $se->id], [
                'first_name' => $se->nameAddress->firstName,
                'last_name' => $se->nameAddress->lastName,
                'card_number' => $se->timeclockId,
                'department' => $se->organizations[0]->value
            ]);
            Log::alert("employee: " . $employee->card_number . " - " . $employee->first_name . " " . $employee->last_name);
        });

        // if employee was removed from iSolved then we should also remove them
        if ($myEmployees->count() > $solvedEmployees->count()) {
            $myEmployees->each(function ($me) use ($solvedEmployees) {
                $exists = $solvedEmployees->filter(function ($se) use ($me) {
                    return $se->id === $me->employee_id;
                });
                if (!$exists->count()) {
                    Log::alert($me->card_number . " - " . $me->first_name . " " . $me->last_name . " has been deleted");
                    $me->delete();
                }
            });
        }
        Log::info('Sync Employees ends');
    }
}
