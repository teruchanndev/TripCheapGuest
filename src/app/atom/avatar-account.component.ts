import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-avatar-account',
    template:  `
        <style>
            .avatar { 
                margin: 0 -1rem; 
                position: absolute; 
                text-align: center; 
                display: flex; 
                justify-content: center; 
            }
            .img_avt {
                font-family: 'Quicksand', Tahoma, Verdana, sans-serif;                
                font-weight: bolder;
                z-index: 1;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                background-color: rgb(102, 160, 247);
            }
            .img_avt > h1 {
                text-align: center;
                font-size: 1.5rem;
                padding: 3px;
            }

        </style>

        <div mat-card-avatar class="avatar">
            <div class="img_avt">
                <h1>{{characterAvt}}</h1>
            </div>
        </div>
    `
})

export class AvatarAccountComponent {
    @Input() characterAvt;
}