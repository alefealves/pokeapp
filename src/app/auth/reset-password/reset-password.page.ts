import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { AuthfirebaseService } from '../../core/services/authfirebase.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { lockClosedOutline, personOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonItem,
  IonInput,
  } from '@ionic/angular/standalone';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule,
    IonItem,
    IonInput,
    ReactiveFormsModule
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ResetPasswordPage implements OnInit {
  ionicForm!: FormGroup;
  email:any
  constructor(private authService:AuthfirebaseService,private toastController: ToastController,private router: Router,
              public formBuilder: FormBuilder) {
    addIcons({
      lockClosedOutline, 
      personOutline,
    });
   }

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
    });
  }

  reset(){

    this.authService.resetPassword(this.email).then((res) => {     
      console.log('sent'); 
      this.presentToast()
    })

  }
  async presentToast(send: boolean = true) {
    if (send){
      let message = 'O link de redefinição de senha foi enviado para o seu email';

      const toast = await this.toastController.create({
        message: message,
        duration: 2000, 
        position: 'bottom' 
      });
    
      toast.present();
      toast.onDidDismiss().then(()=>{
        this.router.navigate(['/login']);
      });
    }else{
      let message = 'Email não encontrado no cadastro';

      const toast = await this.toastController.create({
        message: message,
        duration: 2000, 
        position: 'bottom' 
      });
    
      toast.present();
      toast.onDidDismiss().then(()=>{
        this.router.navigate(['/reset-password']);
      });
    }
   
  }

  get errorControl() {
    return this.ionicForm.controls;
  }
}
