<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AreaResource;
use App\Http\Requests\AreaRequest;
use Spatie\QueryBuilder\QueryBuilder;
use App\Models\Area;

class AreaController extends Controller
{
    /**
     * AreaController constructor.
     */
    public function __construct()
    {
        $this->middleware('auth')->except(['index', 'show']);
    }

    /**
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        $areas = QueryBuilder::for(Area::class)
            ->allowedFilters(['name', 'description'])
            ->allowedSorts(['name'])
            ->allowedIncludes(['tasks'])
            ->get();

        return AreaResource::collection($areas);
    }

    /**
     * @param AreaRequest $request
     * @return AreaResource
     */
    public function store(AreaRequest $request)
    {
        $data = $request->validated();
        $area = Area::create($data);

        return new AreaResource($area);
    }

    /**
     * @param $id
     * @return AreaResource
     */
    public function show($id)
    {
        $area = QueryBuilder::for(Area::where('id', $id))
            ->allowedIncludes(['tasks'])
            ->first();
        return new AreaResource($area);
    }

    /**
     * @param AreaRequest $request
     * @param $id
     * @return AreaResource
     */
    public function update(AreaRequest $request, $id)
    {
        $area = tap(Area::findOrFail($id))
            ->update($request->validated())
            ->fresh();

        return new AreaResource($area);
    }

    /**
     * @param $id
     * @return mixed
     */
    public function destroy($id)
    {
        $area = Area::findOrFail($id);
        $area->delete();

        return $area;
    }
}
