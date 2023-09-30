<?php

namespace App\Http\Controllers\Api;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

class UserController extends Controller
{
    /**
     * UserController constructor.
     */
    public function __construct()
    {
        $this->middleware("auth");
    }

    /**
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        $users = QueryBuilder::for(User::class)->get();

        return UserResource::collection($users);
    }

    /**
     * @param Request $request
     * @return User|mixed
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $userCreator = new CreateNewUser();
        $user = $userCreator->create($request->input());
        return new UserResource($user);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * @param $id
     * @return mixed
     */
    public function destroy($id)
    {
        $user = User::find($id);
        return $user->delete();
    }

    /**
     * @param Request $request
     * @param $id
     */
    public function resetPassword(Request $request, $id)
    {
        $passwordResetter = new ResetUserPassword();
        $user = User::find($id);
        $passwordResetter->reset($user, $request->input());
    }

    /**
     * @param Request $request
     * @param $id
     */
    public function updateProfile(Request $request, $id)
    {
        $profileUpdater = new UpdateUserProfileInformation();
        $user = User::find($id);
        $profileUpdater->update($user, $request->input());
        return $user->fresh();
    }
}
