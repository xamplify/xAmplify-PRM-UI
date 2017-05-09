import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacebookService } from '../../services/facebook.service';

@Component({
    selector: 'app-facebook-posts',
    templateUrl: './facebook-posts.component.html',
    styleUrls: ['./facebook-posts.component.css']
})
export class FacebookPostsComponent implements OnInit {
    posts: any;
    constructor(private route: ActivatedRoute, private facebookService: FacebookService) { }
    getPosts(ownerId: string) {
        this.facebookService.getPosts(localStorage.getItem('facebook'), ownerId)
            .subscribe(
            data => this.posts = data,
            error => console.log(error),
            () => console.log('getPosts() Finished.')
            );
    }
    ngOnInit() {
        try {
            const ownerId = this.route.snapshot.params['ownerId'];
            this.getPosts(ownerId);
        } catch (err) {
            console.log(err);
        }
    }
}
