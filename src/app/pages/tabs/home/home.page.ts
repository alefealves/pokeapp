import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Pokemon } from 'src/app/core/models/pokemon.list';
import { PokemonService } from 'src/app/core/services/pokemon.service';
import { AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';
import { catchError, finalize } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthfirebaseService } from '../../../core/services/authfirebase.service';
import { MenuController } from '@ionic/angular';
import { 
  IonHeader,
  IonTitle,
  IonContent,
  InfiniteScrollCustomEvent,
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
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
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
export class HomePage implements OnInit {
  private authService = inject(AuthfirebaseService);
  private router = inject(Router);
  private pokemonService = inject(PokemonService);
  private alertController = inject(AlertController);
  private menuCtrl = inject(MenuController);

  search = new FormControl('');
  public pokemonsList: Pokemon[] = [];
  public pokemonsListAll: Pokemon[] = [];
  public searchPokemon: Pokemon[] = []; 
  results = [...this.pokemonsListAll];

  private offset = 0;
  private limit = 20;
  isLoading = true;
  isLastPage = false;
  classicMode: boolean = true;
  isSearching = false;
  public error = null;
  public email: any;

  constructor() {
    addIcons({
      heart,
      heartOutline,
    })
  }

  ngOnInit() {

    this.authService.getProfile().then(user => {
      this.email = user?.email;
      //console.log(user);
    }).catch(error => {
      console.error('Error getting user profile:', error);
    });

    this.loadPokemons();
    this.loadAllPokemons();
  }

  async loadPokemons(event?: InfiniteScrollCustomEvent) {
    this.error = null;

    if (!event) {
      this.isLoading = true;
    }

    this.pokemonService
      .getPokemonsList(this.offset, this.limit)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        catchError((err: any) => {
          this.error = err.error.status_message;
          return [];
        })
      )
      .subscribe({
        next: (res: Pokemon[]) => {

          this.pokemonsList = this.pokemonsList.concat(res);
          event?.target.complete();
    
          if (event) {
            event.target.disabled = res.length === 0;
          }
        },
      });
  }
  
  loadMore(event: InfiniteScrollCustomEvent) {
    this.offset += this.limit;
    this.loadPokemons(event);
  }

  getPrincipalType(list: any[]) {
    return list.filter(x => x.slot === 1)[0]?.type.name;
  }

  async loadAllPokemons() {
    this.pokemonService
      .getAllPokemons()
      .subscribe({
        next: (res: Pokemon[]) => {
          this.pokemonsListAll = res;
        },
      });
  }

  onSearchPokemon() {
    const searchTerm = this.search.value?.trim().toLowerCase();
    this.isLoading = true;
    this.isSearching = true;
    if (typeof searchTerm === 'number') {
      this.searchPokemon = this.pokemonsListAll.filter(p => p.id === searchTerm);
    } else if (typeof searchTerm === 'string') {
      const lowerCaseName = searchTerm.toLowerCase();
      this.searchPokemon = this.pokemonsListAll.filter(pokemon => pokemon.name.toLowerCase() === lowerCaseName);
    }
    this.isLoading = false;
  }

  selectPokemon(name: string) {
    this.search.setValue(name);
    this.onSearchPokemon();
  }

  isFavorite(id: any): boolean {
    return this.pokemonService.isFavorite(id);
  }

  handleInput(event: any) {
    const query = event.target.value.trim().toLowerCase();
    if (query.length === 0) {
      this.isSearching = false;
      return;
    }
    this.isSearching = true;
    this.isLoading = true;
    this.results = this.pokemonsListAll.filter((p) => {
      return p.name.toLowerCase().includes(query) || p.id.toString().includes(query);
    });
  }

  onCancel(event: any) {
    this.isSearching = false;
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
            console.log('Confirm Okay');
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
            this.logout();
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  async logout(){
    this.authService.SignOut().then(() =>{
      this.router.navigate(['/landing'])
    }).catch(err => console.log(err));
  }

  async navigateTo(route: string) {
    await this.menuCtrl.close();
    this.router.navigate([route]);
  }
  
}
