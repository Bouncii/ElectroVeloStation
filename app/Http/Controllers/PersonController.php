<?php

namespace App\Http\Controllers;

use App\Models\Person;
use Illuminate\Http\Request;

class PersonController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'age' => 'required|integer|min:0',
            'required_bike_size' => 'required|integer|min:0',
            'user_id' => 'nullable|exists:users,id',
        ]);

        Person::create($validated);
        return redirect()->back()->with('success', 'Nouvelle personne ajoutée !');
    }


    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, Person $person)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'age' => 'required|integer|min:0',
            'required_bike_size' => 'required|integer|min:0',
        ]);
        $person->update($validated);
        return redirect()->back()->with('success', 'Modifications enregistrées.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Person $person)
    {
        $person->delete();
        return redirect()->back()->with('success', 'Personne supprimée de la liste.');
    }
}
