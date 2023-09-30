<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\EmployeeResource;
use App\Http\Resources\CustomerResource;
use App\Http\Resources\TaskResource;
use App\Http\Resources\JobTypeResource;

class JobResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'number' => $this->number,
            'csr' => new EmployeeResource($this->whenLoaded('csr')),
            'csr_id' => $this->csr_id,
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'customer_id' => $this->customer_id,
            'date_created' => $this->date_created,
            'date_target_completion' => $this->date_target_completion,
            'date_released_to_production' => $this->date_released_to_production,
            'date_completed' => $this->date_completed,
            'date_billed' => $this->date_billed,
            'date_closed' => $this->date_closed,
            'pieces_estimated' => $this->pieces_estimated,
            'pieces_actual' => $this->pieces_actual,
            'status' => $this->status,
            'tasks' => TaskResource::collection($this->whenLoaded('tasks')),
            'type' => new JobTypeResource($this->type),
            'job_type_id' => $this->job_type_id
        ];
    }
}
