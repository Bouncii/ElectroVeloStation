<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller{
    private function rememberPreviousUrl(){ // methode pour enregistrer l'url avant l'acces au formulaire (n'enregistre pas le changement de page sur celui-ci)
        $previousUrl = url()->previous();
        if ($previousUrl !== route('login') && $previousUrl !== route('register')) {
            session(['url.intended' => $previousUrl]);
        }
    }

    public function showLogin() {
        $this -> rememberPreviousUrl();
        return Inertia::render('connexion');
    }
    public function showRegister() {
        $this -> rememberPreviousUrl();
        return Inertia::render('creerCompte');
    }

    public function register(Request $request){
        $credentials = $request->validate([
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required',
        ]);

        $user = User::create([
            'last_name' => $credentials['last_name'],
            'first_name' => $credentials['first_name'],
            'email' => $credentials['email'],
            'password' => Hash::make($credentials['password']),
        ]);

        Auth::login($user);
        return redirect()->intended('/');
    }

    public function login(Request $request){
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->intended('/');
        }

        return back()->withErrors(['email' => 'Identifiants incorrects.']);
    }

    public function logout(Request $request){
        Auth::logout();
        $request->session()->invalidate();
        return redirect('/');
    }
}