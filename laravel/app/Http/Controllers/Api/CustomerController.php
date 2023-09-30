<?php

namespace App\Http\Controllers\Api;

use App\Models\Customer;
use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerResource;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class CustomerController extends Controller
{
    /**
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $customers = QueryBuilder::for(Customer::class)
            ->allowedFilters([
                'CLLOCN_CompanyName',
                AllowedFilter::scope('name')])
            ->allowedSorts(['name']);

        $result = $request->has('page') ? $customers->jsonPaginate(120) : $customers->get();

        return CustomerResource::collection($result);
    }

    /**
     * @param $id
     * @return CustomerResource
     */
    public function show($id)
    {
        $customer = Customer::findOrFail($id);

        return new CustomerResource($customer);
    }
}
