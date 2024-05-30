import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from 'src/app/core/services/pokemon.service';
import { AlertController } from '@ionic/angular';
import { PokemonDetail } from 'src/app/core/models/pokemon.detail';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';
import { 
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonText,
  IonTitle,
  IonToolbar,
  IonFooter,
  IonTabs,
  IonTabBar,
  } from '@ionic/angular/standalone';
@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonText,
    IonLabel,
    IonButtons,
    IonBackButton,
    IonItem,
    IonFooter,
    CommonModule,
    IonTabs,
    IonTabBar,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DetailsPage implements OnInit {
  private pokemonService = inject(PokemonService);
  private alertController = inject(AlertController);
  public pokemon: WritableSignal<PokemonDetail | null> = signal<PokemonDetail | null>(null);

  constructor() { }

  ngOnInit() {
    addIcons({
      heart,
      heartOutline,
      
    })
  }

  @Input()
  set id(id: string) {
    this.pokemonService.getPokemonDetail(id).subscribe((res: any) => {
      this.pokemon.set(res);
    });
  }

  isFavorite(id: any): boolean {
    return this.pokemonService.isFavorite(id);
  }

  getPrincipalType(list: any[]) {
    return list.filter(x => x.slot === 1)[0]?.type.name;
  }

  async AlertConfirmFavorite(pokemon: PokemonDetail) {
    let message = '';
    if (this.isFavorite(pokemon.id)) {
      message = 'Are you right in removing '+pokemon.name+' from favorite?';
    } else {
      message = 'Are you right in marking '+pokemon.name+' as favorite?';
    }
    
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirm',
          handler: () => {
            this.pokemonService.toggleFavoriteDetail(pokemon);
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  getAbilities(): string {
    const pokemon = this.pokemon();
    if (pokemon) {
      return pokemon.abilities.map(ability => ability.ability.name).join(', ');
    }
    return '';
  }

  getStatByName(name: string) {
    const pokemon = this.pokemon();
    if (pokemon) {
      return pokemon.stats.filter(x => x.stat.name === name)[0]?.base_stat;
    }
    return 0;
  }
}
