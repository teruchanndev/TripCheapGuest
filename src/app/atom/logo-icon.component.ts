import { Component } from '@angular/core';

@Component({
    selector: 'app-logo-icon',
    template:  `
        <div style="display: flex; align-items: center; padding-left: 9rem;">
            <img 
                src="../../../assets/icon/brand.svg" 
                style="width: 35px; height: 35px;">
            <div 
                style="padding-left: 0.5rem;">
                <h1 
                    class="logo_detail" 
                    style="color:rgb(153, 44, 255); font-weight: bolder;font-size: 30px;">
                    <span 
                        style="color: rgb(102, 160, 247);">Trip</span>
                    <span>Cheap</span>
                </h1>
            </div>
        </div>
    `
})

export class LogoIconComponent {

}