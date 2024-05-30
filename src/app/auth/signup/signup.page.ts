import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthfirebaseService } from 'src/app/core/services/authfirebase.service';
import { FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, lockClosedOutline, callOutline } from 'ionicons/icons';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonIcon,
  IonText,
  IonItem,
  IonInput,
 } from '@ionic/angular/standalone';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule,
    IonIcon,
    IonText,
    IonItem,
    IonInput,
    RouterModule,
    ReactiveFormsModule,
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SignupPage implements OnInit {

  private authService = inject(AuthfirebaseService);
  ionicForm!: FormGroup;

  constructor(private toastController: ToastController,private loadingController: LoadingController,private router: Router, public formBuilder: FormBuilder) { 
    addIcons({
      personOutline, mailOutline, lockClosedOutline, callOutline
    });
  }

  ngOnInit() {
    // this.signUP()
    this.ionicForm = this.formBuilder.group({
      fullname:['',
        [Validators.required]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      password: ['', [
        //Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}'),
        Validators.required,
        Validators.minLength(6),
      ],
    ],
    });
  }
  get errorControl() {
    return this.ionicForm.controls;
  }
  // async signUpWithGoogle(){
  //   const loading = await this.loadingController.create();
  //   // await loading.present();

  //   const user = await this.authService.GoogleAuth().then((re)=>{
  //     console.log(re);
      
  //     // this.router.navigate(['/home'])
  //   })
  // }
 
  async signUP(){
    const loading = await this.loadingController.create();
    await loading.present();
    if (this.ionicForm.valid) {

      const user = await this.authService.registerUser(this.ionicForm.value.email, this.ionicForm.value.password).catch((err) => {
        this.presentToast(err)
        console.log(err);
        loading.dismiss();
      })

      if (user) {
        loading.dismiss();
        this.router.navigate(['/login'])
      }
    } else {
      return console.log('Favor, informe dados válidos!');
    }
  }
  
  async presentToast(message: undefined) {
    console.log(message);
    
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
    });

    await toast.present();
  }

}
