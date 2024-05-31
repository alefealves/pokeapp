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
 
  async signUP(){
    const loading = await this.loadingController.create();
    await loading.present();
    if (this.ionicForm.valid) {

      this.authService.RegisterUser(this.ionicForm.value.email, this.ionicForm.value.password)
      .then((res) => {
        
        this.authService.SendVerificationMail().then(() => {
          loading.dismiss();
          this.presentToast('Por favor, verifique seu email para confirmar o cadastro!');
          this.router.navigate(['/login']);
        }).catch((error) => {
          console.log(error);
          loading.dismiss();
          this.presentToast('Erro ao enviar o email de verificação, verifique se o email é válido.');
        })

      }).catch((error) => {

        console.log(error);
        loading.dismiss();
        this.presentToast('Erro ao cadastrar usuário verifique se o email é válido.');
      })

    } else {
      return console.log('Favor, informe dados válidos!');
    }
  }
  
  async presentToast(message: string) {
    console.log(message);
    
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: 'top',
    });

    await toast.present();
  }

}
