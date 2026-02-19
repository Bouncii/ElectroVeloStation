<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles): Response #$roles permet de stack les param_tres 
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }
        $user = Auth::user();
        if (in_array($user->role, $roles)) {
            return $next($request);
        }
        abort(403, "Vous n'avez pas les droits pour accéder à cette page.");
    }
}
