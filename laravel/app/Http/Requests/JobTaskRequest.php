<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JobTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $isPost = $this->isMethod('POST');

        return [
            'task_type_id' => [Rule::requiredIf($isPost), 'numeric'],
            'assembly_number' => ['numeric'],
            'supervisor_id' => ['numeric'],
            'employee_id' => [Rule::requiredIf($isPost), 'numeric'],
            'start' => [Rule::requiredIf($isPost), 'date'],
            'stop' => ['nullable', 'date', 'after:start'],
            'duration' => ['numeric'],
            'area_id' => [Rule::requiredIf($isPost), 'numeric'],
            'created_by' => ['string'],
            'updated_by' => ['string'],
        ];
    }
}
