<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use App\User;

class UserController extends Controller
{
    //
    public function test(Request $request){
        return "Test Usuarios";
    }

    public function register(Request $request){
        
        //Recoger datos del usuario por post
        $json = $request->input('json', null);
        
        $params = json_decode($json);   // Objeto
        $params_array = json_decode($json, true);   //Array
        //var_dump($params->name); die();
        //var_dump($params_array['name']); die();

        if(!empty($params) && !empty($params_array)){
            //Limpiar datos
            $params_array = array_map('trim', $params_array);   //limpia los espacios y datos del array

            //Validar datos
            $validate = Validator::make($params_array, [
                'name'      => 'required|alpha',
                'surname'   => 'required|alpha',
                'email'     => 'required|email|unique:users',
                'password'  => 'required'
            ]);

            if($validate->fails()){
                
                $data = array(
                    'status' => 'error',
                    'code' => 404,
                    'message' => 'El usuario no se ha creado correctamente',
                    'errors' => $validate->errors()
                );
                
                //return response()->json($data, 404);
            }else{
                //Cifrar la contraseña
                //$pwd = password_hash($params->password, PASSWORD_BCRYPT, ['cost' => 4]);
                $pwd = hash('sha256', $params->password);

                //Crear el usuario
                $user = new User();
                $user->name = $params_array['name'];
                $user->surname = $params_array['surname'];
                $user->email = $params_array['email'];
                $user->password = $pwd;
                $user->role = 'ROLE_USER';

                //Guardar el usuario
                $user->save();

                
                
                $data = array(
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'El usuario se ha creado correctamente',
                    'user' => $user
                );

                
            }
            

        }else{
            $data = array(
                'status' => 'error',
                'code' => 404,
                'message' => 'Los datos enviados no son correctos'               
            );
        }

        

        




        

        return response()->json($data, $data['code']);
    }

    public function login(Request $request){
        
        $jwtAuth = new \JwtAuth();

        //Recibir post
        $json = $request->input('json', null);
        $params = json_decode($json);
        $params_array = json_decode($json, true);

        //Validar datos
        $validate = Validator::make($params_array, [
            'email'     => 'required|email',
            'password'  => 'required'
        ]);

        if($validate->fails()){
            
            $signup = array(
                'status' => 'error',
                'code' => 404,
                'message' => 'El usuario no se ha logueado correctamente',
                'errors' => $validate->errors()
            );
            
            //return response()->json($data, 404);
        }else{
            //Cifrar contraseña
            $pwd = hash('sha256', $params->password);
            //Devolver token o datos
            $signup = $jwtAuth->signup($params->email, $pwd);
            if(!empty($params->gettoken)){
                $signup = $jwtAuth->signup($params->email, $pwd, true);
            }
        }

        
      
        //$pwd = password_hash($password, PASSWORD_BCRYPT, ['cost' => 4]);
        

        return response()->json($signup, 200);
        //return response()->json($jwtAuth->signup($email, $pwd, true), 200);
    }

    public function update(Request $request){
        //Comprobar que el usuario este identificado
        $token = $request->header('Authorization');
        $jwtAuth = new \JwtAuth();
        $checkToken = $jwtAuth->checkToken($token);

        //Recoger datos por post
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);

        if($checkToken && !empty($params_array)){
            
            //Actualizar usuario

            

            //Sacar usuario identificado
            $user = $jwtAuth->checkToken($token, true);

            //Validar los datos
            $validate = \Validator::make($params_array, [
                'name'      => 'required|alpha',
                'surname'   => 'required|alpha',
                'email'     => 'required|email|unique:users,'.$user->sub
            ]);
            //Quitar campos que no quiero actualizar
            unset($params_array['id']);
            unset($params_array['role']);
            unset($params_array['password']);
            unset($params_array['created_at']);
            unset($params_array['remember_token']);

            //Actualizar usuario en base de datos
            $user_update = User::where('id', $user->sub)->update($params_array);
            //Devolver array con resultado
            $data = array(
                'code' => 200,
                'status' => 'success',
                'user' => $user,
                'changes' => $params_array
            );
        }else{
            $data = array(
                'code' => 404,
                'status' => 'error',
                'message' => 'El usuario no esta identificado correctamente'
            );
        }

        return response()->json($data, $data['code']);
    }

    public function upload(Request $request){
        //Recoger datos de la peticion
        $image = $request->file('file0');

        //Validacion de imagen
        $validate = \Validator::make($request->all(), [
            'file0' => 'required|image|mimes:jpg,jpeg,png,gif'
        ]);


        //Subir y guardar imagen
        if(!$image || $validate->fails()){
            $data = array(
                'code' => 400,
                'status' => 'error',
                'message' => 'La imagen no se podido subir'
            );
        }else{
            
            $image_name = time().$image->getClientOriginalName();
            \Storage::disk('users')->put($image_name, \File::get($image));

            $data = array(
                'code' => 200,
                'status' => 'success',
                'image' => $image_name,
            );
        }

        //Devolver el resultado
        
        
        
        return response()->json($data, $data['code']);
        //return response($data, $data['code'])->header('Content-Type','text/plain');
    }

    public function getImage($filename){
        $isset = \Storage::disk('users')->exists($filename);

        if($isset){
            $file = \Storage::disk('users')->get($filename);
            return new Response($file, 200);
        }else{
            $data = array(
                'code' => 404,
                'status' => 'error',
                'message' => 'La imagen no existe'
            );

            return response()->json($data, $data['code']);
        }
        
        
    }

    public function detail($id){
        $user = User::find($id);

        if(is_object($user)){
            $data = array(
                'code' => 200,
                'status' => 'success',
                'user' => $user
            );
        }else{
            $data = array(
                'code' => 404,
                'status' => 'error',
                'message' => 'El usuario no existe'
            );
        }

        return response()->json($data, $data['code']);
    }
}
