import { Component, OnInit, Input } from '@angular/core';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  providers: [PostService]
})
export class PostListComponent implements OnInit {

  @Input() posts;
  @Input() identity;
  @Input() url;
  
  constructor(
    private _postService: PostService
  ) { }

  ngOnInit(): void {
  }

  

}
