import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post';
import { global } from '../../services/global';

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css'],
  providers: [UserService, CategoryService, PostService]
})
export class PostNewComponent implements OnInit {

  public page_title: string;
  public identity;
  public token;
  public post: Post;
  public categories;
  public resetVar;
  public status;
  public is_edit;
  

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
      url:global.url+"post/upload",
      headers: {
    "Authorization" : this._userService.getToken()
      }
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: "Imagen del artículo"
    
    };

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _postService: PostService
  ) {
    this.page_title = "Crear nueva entrada";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
   }

  ngOnInit(): void {
    this.getCategories();
    this.post = new Post(1,this.identity.sub,1,"", "", null,null);
    //console.log(this.post)
  }

  getCategories(){
    this._categoryService.getCategories().subscribe(
      response =>{
        if(response.status == 'success'){
          this.categories = response.categories;
          //console.log(this.categories);
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  imageUpload(datos){
    //console.log(JSON.parse(datos.response))
    let image_data = JSON.parse(datos.response);
    this.post.image = image_data.image;
  }

  onSubmit(form){
    //console.log(this._postService.pruebas());
    this._postService.create(this.token, this.post).subscribe(
      response =>{
        if(response.status == 'success'){
          this.post = response.post;
          this.status = 'success';
          this._router.navigate(['/inicio']);
        }else{
          this.status = 'error';
        }
      },
      error => {
        console.log(error);
        this.status = 'error';
      }
    );
  }

}
