import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { global } from '../../services/global';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {

  public page_title: string;
  public user: User;
  public identity;
  public token;
  public status;
  public url;
  public resetVar;
  
  

  public froala_options: Object = {
    charCounterCount: true,
    language: 'es',
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat'],
  };

  public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png,.gif,.jpeg",
    maxSize: "50",
    uploadAPI:  {
      url:global.url+"user/upload",
      headers: {
    "Authorization" : this._userService.getToken()
      }
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: "Foto de perfil"
    
    };


  constructor(
    private _userService: UserService
  ) {
    this.page_title = 'Ajustes de usuario';
    this.user = new User(1, '', '', 'ROLE_USER', '', '', '', '');
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = global.url;

    //Rellenar objeto de usuario
    this.user = this.identity;
    this.user = new User(
      this.identity.sub,
      this.identity.name,
      this.identity.surname,
      this.identity.role,
      this.identity.email, '',
      this.identity.description,
      this.identity.image
      );
   }

  ngOnInit(): void {
  }

  onSubmit(form){
    this._userService.update(this.token, this.user).subscribe(
      response => {
        //console.log(response);
        if(response && response.status){
          this.status = 'success';

          //Actualizar usuario en sesion
          if(response.changes.description){
            this.user.name = response.changes.description;
          }
          if(response.changes.image){
            this.user.name = response.changes.image;
          }
          

          if(response.changes.email){
            this.user.name = response.changes.email;
          }
          if(response.changes.surname){
            this.user.name = response.changes.surname;
          }

          if(response.changes.name){
            this.user.name = response.changes.name;
          }
          
          
          
          
          
          

          
           
          this.identity = this.user;
          localStorage.setItem('identity', JSON.stringify(this.identity))
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

  avatarUpload(datos){
    //console.log(JSON.parse(datos.response))
    let data = JSON.parse(datos.response);
    this.user.image = data.image;
  }

}
