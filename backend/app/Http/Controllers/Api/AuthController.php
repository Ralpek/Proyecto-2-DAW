<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validamos que nos envíen email y password
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Buscamos al usuario por su email
        $user = User::where('email', $request->email)->first();

        // 3. Comprobamos si existe y si la contraseña coincide
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['mensaje' => 'Credenciales incorrectas'], 401);
        }

        // 4. Si todo es correcto, creamos el "pase VIP" (Token)
        $token = $user->createToken('token_acceso')->plainTextToken;

        // 5. Devolvemos el token y los datos del usuario a Angular
        return response()->json([
            'mensaje' => 'Login exitoso',
            'token' => $token,
            'usuario' => $user
        ]);
    }
}