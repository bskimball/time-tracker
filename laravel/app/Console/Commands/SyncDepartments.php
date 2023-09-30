<?php

namespace App\Console\Commands;

use App\Department;
use Illuminate\Console\Command;
use App\Repository\SolvedRepository;

class SyncDepartments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync_departments';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Syncs Departments with iSolved';

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
     * Get departments from iSolved and load into the database
     *
     * @param SolvedRepository $solved
     */
    public function handle(SolvedRepository $solved)
    {
        $departments = $solved->getDepartments();

        foreach ($departments as $department) {
            if (!$department->isInactive) {
                Department::updateOrCreate(['name' => $department->code], [
                    'description' => $department->description
                ]);
            }
        }

        $locals = Department::all();
        foreach ($locals as $local) {
            $exists = array_filter($departments, function ($value) use ($local) {
                return $value->code === $local->name && !$value->isInactive;
            });
            if (!sizeof($exists)) {
                $local->delete();
            }
        }
    }
}
