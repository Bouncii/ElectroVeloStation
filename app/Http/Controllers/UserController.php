<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(){
        return Inertia::render('gestionUsers', [
        'users' => User::with('people')->latest()->get()
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request){
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required',
            'role'       => 'required|string|in:admin,employé,client',
        ]);

        User::create([
            'first_name' => $validated['first_name'],
            'last_name'  => $validated['last_name'],
            'email'      => $validated['email'],
            'role'       => $validated['role'],
            'password'   => Hash::make($validated['password']),
        ]);

        return redirect()->back()->with('success', 'Utilisateur créé avec succès !');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user){
            $validated = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name'  => 'required|string|max:255',
                'email'      => 'required|email|unique:users,email,' . $user->id,
                'role'       => 'required|string',
                'password'   => 'nullable',
            ]);

            $user->fill([
                'first_name' => $validated['first_name'],
                'last_name'  => $validated['last_name'],
                'email'      => $validated['email'],
                'role'       => $validated['role'],
            ]);

            if (!empty($validated['password'])) {
                $user->password = Hash::make($validated['password']);
            }
            $user->save();
            return redirect()->back()->with('success', 'Utilisateur mis à jour !');
        }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if (auth::id() === $user->id) {
            return redirect()->back()->with('error', 'Vous ne pouvez pas supprimer votre propre compte.');
        }
        $user->delete();
        return redirect()->back()->with('success', 'Utilisateur supprimé définitivement.');
    }
}
