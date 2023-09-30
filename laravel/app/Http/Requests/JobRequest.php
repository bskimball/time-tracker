<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JobRequest extends FormRequest
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
            'number' => [Rule::requiredIf($isPost), 'numeric'],
            'job_type_id' => [Rule::requiredIf($isPost), 'numeric'],
            'csr_id' => 'numeric',
            'customer_id' => [Rule::requiredIf($isPost), 'numeric'],
            'date_created' => [Rule::requiredIf($isPost), 'date'],
            'date_target_completion' => 'date|after_or_equal:date_created',
            'date_released_to_production' => 'date',
            'date_completed' => 'date|after_or_equal:date_created|nullable',
            'date_billed' => 'date|nullable',
            'date_closed' => 'date|after_or_equal:date_billed|nullable',
            'pieces_estimated' => 'numeric',
            'pieces_actual' => 'numeric|nullable',
            'status' => 'string'
        ];
    }
}
