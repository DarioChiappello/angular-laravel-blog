import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  public page_title: string;
  public user: User;
  public status: string;
  public token;
  public identity;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.page_title = "Iniciar Sesión";
    this.user = new User(1, '', '', 'ROLE_USER', '', '', '', '');
   }

  ngOnInit(): void {
    //Se ejecuta siempre y cierra sesion solo cuando le llega el parametro sure por la url
    this.logout();
  }

  onSubmit(form){
    //console.log(this.user);
    this._userService.signup(this.user).subscribe(
      response => {
        //console.log(response);

        //Token
        if(response.status != 'error'){
          this.status = 'success';
          this.token = response;

          //Objeto usuario identificado
          this._userService.signup(this.user, true).subscribe(
                response => {
                //console.log(response);
        
                
                  //Identidad del usuario
                  this.identity = response;
        
                  //console.log(this.token);
                  //console.log(this.identity);

                  // Persistir datos del usuario identificado
                  localStorage.setItem('token', this.token);
                  localStorage.setItem('identity',JSON.stringify(this.identity));

                  //Redirecionar a inicio
                  this._router.navigate(['inicio']);
              },
              error => {
                
                this.status = 'error';
                //console.log(<any>error);
        
              }
            );
        }else{
          this.status = 'error';
        }
      },
      error => {
        
        this.status = 'error';
        //console.log(<any>error);

      }
    );
  }

  logout(){
    this._route.params.subscribe(params => {
      let logout = +params['sure'];
      if(logout == 1){
        localStorage.removeItem('identity');
        localStorage.removeItem('token');

        this.identity = null;
        this.token = null;

        //Redirecionar a inicio
        this._router.navigate(['inicio']);
      }
    });
  }

}
