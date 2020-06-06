import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SocialService } from '../../services/social.service';

@Component({
    selector: 'app-social-login',
    templateUrl: './social-login.component.html',
    styleUrls: ['./social-login.component.css']
})
export class SocialLoginComponent implements OnInit {
    error: string;
    constructor(private router: Router, private route: ActivatedRoute, private socialService: SocialService) { }

    login(providerName: string) {
        this.socialService.login(providerName)
            .subscribe(
            result => {
                console.log('redirect url: ' + result);
                window.location.href = '' + result;
               // window.open('redirect url: ');
               // window.open("'redirect url: '" + result);
               // window.open(" " + result, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=600,left=600,width=600,height=600");
       
            },
            error => {
                console.log(error);
                this.error = error;
            },
            () => console.log('login() Complete'));
    }
    
    reload(){
        window.location.reload();
    }

    ngOnInit() {
        try {
            const providerName = this.route.snapshot.params['social'];
            this.login(providerName);
        }
        catch (err) {
            console.log(err);
        }
    }

}
