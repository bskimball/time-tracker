<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\TaskResource;

class EmployeeResource extends JsonResource
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
            'employee_id' => $this->employee_id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'card_number' => $this->card_number,
            'tasks' => TaskResource::collection($this->whenLoaded('tasks'))
        ];
    }
}
