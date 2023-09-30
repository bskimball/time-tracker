<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\AreaResource;
use App\Http\Resources\EmployeeResource;
use App\Http\Resources\TaskTypeResource;
use App\Http\Resources\JobResource;

class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'area' => new AreaResource($this->whenLoaded('area')),
            'area_id' => $this->area_id,
            'assembly_number' => $this->assembly_number,
            'created_by' => $this->created_by,
            'duration' => $this->duration,
            'employee' => new EmployeeResource($this->whenLoaded('employee')),
            'employee_id' => $this->employee_id,
            'job' => new JobResource($this->whenLoaded('job')),
            'job_id' => $this->job_id,
            'start' => $this->start,
            'status' => $this->status,
            'stop' => $this->stop,
            'supervisor' => new EmployeeResource($this->whenLoaded('supervisor')),
            'supervisor_id' => $this->supervisor_id,
            'type' => new TaskTypeResource($this->whenLoaded('type')),
            'task_type_id' => $this->task_type_id,
            'updated_by' => $this->updated_by,
        ];
    }
}
