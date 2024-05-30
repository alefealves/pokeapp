import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { lockClosedOutline, personOutline } from 'ionicons/icons';
import { AuthfirebaseService } from 'src/app/core/services/authfirebase.service';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonIcon,
  IonFab,
  IonFabButton,
  IonText,
  IonButton,
  IonItem,
  IonInput,
 } from '@ionic/angular/standalone';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule,
    IonIcon,
    IonFab,
    IonFabButton,
    IonText,
    RouterModule,
    IonButton,
    IonItem,
    IonInput,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginPage implements OnInit {

  private authService = inject(AuthfirebaseService);
  ionicForm!: FormGroup;

  constructor(private toastController: ToastController, private alertController: AlertController, private loadingController: LoadingController, private router: Router, public formBuilder: FormBuilder) { 
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
      password: ['', [
        // Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}'),
        Validators.required,
        Validators.minLength(6),
      ]
      ],
    });
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
    //console.log(this.ionicForm.value.email + this.ionicForm.value.password);
    if (this.ionicForm.valid) {

      //  await  loading.dismiss();
      //console.log(this.ionicForm.value.email);
      const user = await this.authService.loginUser(this.ionicForm.value.email, this.ionicForm.value.password).catch((err) => {
        this.presentToast("Credencias inválidas, tente novamente.");
        console.log(err);
        loading.dismiss();
      })

      if (user) {
        loading.dismiss();
        this.router.navigate(
          ['/tabs/home'],)
      }
    } else {
      return console.log('Favor, informe dados validos!');
    }

  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  async presentToast(message: string) {
    console.log(message);

    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
    });

    await toast.present();
  }

}
