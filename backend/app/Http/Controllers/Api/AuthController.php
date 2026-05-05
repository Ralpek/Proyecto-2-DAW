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
        // 1. Validamos que nos envíen username
        $request->validate([
            'username' => 'required|string',
            'password' => 'required',
        ]);

        // 2. Buscamos por username
        $user = User::where('username', $request->username)->first();

        // 3. Comprobamos si existe y si la contraseña coincide
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['mensaje' => 'Usuario o contraseña incorrectos'], 401);
        }

        // 4. Si todo es correcto, creamos el Token
        $token = $user->createToken('token_acceso')->plainTextToken;

        // 5. Devolvemos el token y los datos del usuario a Angular
        return response()->json([
            'mensaje' => 'Login exitoso',
            'token' => $token,
            'usuario' => $user
        ]);
    }
}