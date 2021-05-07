import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {

  public page_title: string;
  public user: User;
  public status: string;

  constructor(
    private _userService: UserService
  ) {
    this.page_title = "Registrarse";
    this.user = new User(1, '', '', 'ROLE_USER', '', '', '', '');
    
   }

  ngOnInit(): void {
    console.log("Componente de registro");
    //console.log(this._userService.test);
  }

  onSubmit(form){
    //console.log(this.user);
    
    this._userService.register(this.user).subscribe(
      response => {
        //console.log(response);
        if(response.status == 'success'){
          this.status = response.status;

          //Vaciar el formulario
          form.reset();
        }else{
          this.status = 'error';
        }

        
      },
      error => {
        this.status = 'error';
        console.log(<any>error);
      }
    );
    
  }

}
