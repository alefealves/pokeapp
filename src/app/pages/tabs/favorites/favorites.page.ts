import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Pokemon } from 'src/app/core/models/pokemon.list';
import { PokemonService } from '../../../core/services/pokemon.service';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';
import { 
  IonHeader,
  IonTitle,
  IonContent,
  IonLabel,
  IonItem,
  IonLoading,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSkeletonText,
  IonAlert,
  IonIcon,
  IonButton,
  IonCard,
  IonRow,
  IonCol,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonSearchbar,
  IonToggle,
  IonProgressBar,
  IonMenu,
  } from '@ionic/angular/standalone';
@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonTitle,
    IonContent,
    IonLabel,
    IonItem,
    IonLoading,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSkeletonText,
    IonAlert,
    RouterModule,
    IonIcon,
    IonButton,
    IonCard,
    IonCardContent,
    IonRow,
    IonCol,
    IonCardSubtitle,
    IonCardTitle,
    IonChip,
    IonSearchbar,
    IonToggle,
    CommonModule,
    IonProgressBar,
    IonMenu,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FavoritesPage implements OnInit {

  private pokemonService = inject(PokemonService);
  private alertController = inject(AlertController);

  public pokemonsFavorites: Pokemon[] = [];
  countFavorites: number = 0;
  classicMode: boolean = true;
  isLoading = true;
  isFavoritesPokemons = false;
  public email: any;

  constructor() {
    addIcons({
      heart,
      heartOutline,
    });
   }

  ngOnInit() {
    this.loadFavorites();
  }

  async loadFavorites() {
    this.isLoading = true;
    this.isFavoritesPokemons = false;
    this.pokemonsFavorites = this.pokemonService.getFavorites();
    if (this.pokemonsFavorites.length > 0) {
      this.isFavoritesPokemons = true;
      this.countFavorites = this.pokemonsFavorites.length;
    }
    this.isLoading = false;
  }

  getPrincipalType(list: any[]) {
    return list.filter(x => x.slot === 1)[0]?.type.name;
  }

  isFavorite(id: any): boolean {
    return this.pokemonService.isFavorite(id);
  }

  async AlertConfirmFavorite(pokemon: Pokemon) {
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
            this.pokemonService.toggleFavorite(pokemon);
            this.loadFavorites();
          }
        }
      ]
    });

    await alert.present();
  }

  async AlertConfirmLogout() {
    let message = 'Are you sure you want to log out?';

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
            //this.logout();
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }
}
