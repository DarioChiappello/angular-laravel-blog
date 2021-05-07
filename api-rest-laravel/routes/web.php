<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
//Clases
use App\Http\Middleware\ApiAuthMiddleware;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test/{nombre?}', function($nombre = null){
    $texto = "<h1>Test  </h1>";
    $texto .= $nombre;
    return view('test', array(
        'texto' => $texto
    ));
});

Route::get('/testOrm', 'TestController@testOrm');


// Rutas del API

//http
/*
get
post
put
delete
*/


// Tests
//Route::get('/users/test', 'UserController@test');
//Route::get('/categories/test', 'CategoryController@test');
//Route::get('/posts/test', 'PostController@test');


// Rutas Usuarios
Route::post('/api/login', 'UserController@login');
Route::post('/api/register', 'UserController@register');
Route::put('/api/user/update', 'UserController@update');
Route::post('/api/user/upload', 'UserController@upload')->middleware(ApiAuthMiddleware::class);
Route::get('/api/user/avatar/{filename}', 'UserController@getImage');
Route::get('/api/user/detail/{id}', 'UserController@detail');


// Rutas Categorias
Route::resource('/api/category', 'CategoryController');

// Rutas Posts
Route::resource('/api/post', 'PostController');
Route::post('/api/post/upload', 'PostController@upload');
Route::get('/api/post/image/{filename}', 'PostController@getImage');
Route::get('/api/post/category/{id}', 'PostController@getPostByCategory');
Route::get('/api/post/user/{id}', 'PostController@getPostByUser');






/*

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');*/
