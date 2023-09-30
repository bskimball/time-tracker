<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next, $role = null)
    {
        if (Auth::guard()->check()) {
            if (strtolower(Auth::user()->role) === strtolower($role)) {
                return $this->handleRedirect(Auth::user()->role);
            }
            if (is_null($role)) {
                return $this->handleRedirect(Auth::user()->role);
            }
        } else {
            return redirect('/start');
        }

        return $next($request);
    }

    private function handleRedirect($role)
    {
        if (strtolower($role) === 'temp') {
            return redirect('/start');
        } else {
            return redirect('/dashboard');
        }
    }
}
