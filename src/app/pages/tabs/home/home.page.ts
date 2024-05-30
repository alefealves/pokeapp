import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Pokemon } from 'src/app/core/models/pokemon.list';
import { PokemonService } from 'src/app/core/services/pokemon.service';
import { AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';
import { catchError, finalize } from 'rxjs';
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
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
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

  private pokemonService = inject(PokemonService);
  private alertController = inject(AlertController);

  search = new FormControl('');
  public pokemonsList: Pokemon[] = [];
  public pokemonsListAll: Pokemon[] = [];
  public searchPokemon: Pokemon[] = []; 

  private offset = 0;
  private limit = 20;
  isLoading = true;
  isLastPage = false;
  classicMode: boolean = true;
  isSearching = false;
  results = [...this.pokemonsListAll];
  public error = null;

  constructor() {
    addIcons({
      heart,
      heartOutline,
    })
  }

  ngOnInit() {
    this.loadPokemons();
    //this.loadAllPokemons();
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
  
}
