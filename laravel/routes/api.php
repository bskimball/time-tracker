<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AreaController;
use App\Http\Controllers\Api\AreaTaskController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\CustomerJobController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\EmployeeTaskController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\JobTaskController;
use App\Http\Controllers\Api\JobTypeController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TaskTypeController;
use App\Http\Controllers\Api\UserController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['throttle:api'], function () {
    Route::get('jobs/last', [JobController::class, 'last']);
    Route::get('jobs/{id}/tasks/count', [JobTaskController::class, 'count']);
    Route::get('users', [UserController::class, 'index']);
    Route::post('users', [UserController::class, 'store']);
    Route::delete('users/{id}', [UserController::class, 'destroy']);
    Route::post('users/{id}/reset-password', [UserController::class, 'resetPassword']);
    Route::put('users/{id}/update-profile', [UserController::class, 'updateProfile']);

    Route::apiResources([
        'areas' => AreaController::class,
        'areas.tasks' => AreaTaskController::class,
        'customers' => CustomerController::class,
        'customers.jobs' => CustomerJobController::class,
        'departments' => DepartmentController::class,
        'employees' => EmployeeController::class,
        'employees.tasks' => EmployeeTaskController::class,
        'jobs' => JobController::class,
        'jobs.tasks' => JobTaskController::class,
        'job-types' => JobTypeController::class,
        'task-types' => TaskTypeController::class
    ]);
});

Route::group(['throttle:tasks'], function () {
    Route::apiResources(['tasks' => TaskController::class]);
});

