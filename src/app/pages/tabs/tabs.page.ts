import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnimationController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heart, heartOutline, homeOutline } from 'ionicons/icons';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonLabel, 
  IonIcon,
  IonTabBar,
  IonTabs,
  IonTabButton,
 } from '@ionic/angular/standalone';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule, 
    IonLabel, 
    IonIcon,
    IonTabBar,
    IonTabs,
    IonTabButton,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TabsPage {

  private animationCtrl = inject(AnimationController);
  selectedTab: any;
  
  constructor() {
    addIcons({
      heart,
      heartOutline,
      homeOutline
    })
   }

  setCurrentTab(event: any) {
    this.selectedTab = event.tab;
    const tabButton = document.querySelector(`ion-tab-button[tab="${this.selectedTab}"]`);
    const fadeInAnimation = this.createFadeInAnimation(tabButton as HTMLElement);
    fadeInAnimation.keyframes([
      { offset: 0, transform: 'scale(1)' },
      { offset: 0.5, transform: 'scale(1.2)' },
      { offset: 1, transform: 'scale(1)' }
    ]);
    fadeInAnimation.play();
  }

  private createFadeInAnimation(baseEl: HTMLElement) {
    return this.animationCtrl.create()
      .addElement(baseEl)
      .duration(300)
      .easing('ease-in-out');
      //.fromTo('opacity', '0', '1');
  }

}
