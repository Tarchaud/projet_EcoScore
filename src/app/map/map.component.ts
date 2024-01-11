import { Component } from '@angular/core';
import * as L from 'leaflet';
import { RestaurantI } from '../shared/model/restaurant-i';
import { ScrappingTripAdvisorService } from '../shared/services/scrapping-trip-advisor.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  private map: any;
  private marker: any;

  activeFilters: string[] = []; // Initialisez à un tableau vide
  displayedMarkers: L.Marker[] = [];



  private listMarkers: RestaurantI[] = [{
    name: 'Paris',
    address : 'Paris',
    lat: 48.8534,
    lng: 2.3488,
    category: 'Organic'
  }, {
    name: 'Lyon',
    address : 'Lyon',
    lat: 45.7578,
    lng: 4.8320,
    category: 'Organic'
  }, {
    name: 'Marseille',
    address : 'Marseille',
    lat: 43.2964,
    lng: 5.3700,
    category: 'Governance'
  }];


  constructor() { }

  ngOnInit() {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [48.8534, 2.3488],
      zoom: 12
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    const bounds = this.map.getBounds();

    this.listMarkers.forEach((marker) => {
      let coord = {lat : marker.lat, lng : marker.lng}
      if (bounds.contains(coord)) {
        this.displayedMarkers.push(L.marker([marker.lat, marker.lng]).bindTooltip(marker.name+'<br>address'+marker.address+'<br>Category : '+ marker.category).addTo(this.map));
      } else {
        this.map.removeLayer(marker);
      }

    })

    this.map.on('moveend', this.handleMapMoveEnd.bind(this));


  }

  handleMapMoveEnd() {
    // Code pour réagir à l'événement moveend
    this.printMarker();
  }

  //
  printMarker() {
    const bounds = this.map.getBounds();
    console.log("updateMarkers");

    this.listMarkers.forEach((marker) => {
      let coord = {lat : marker.lat, lng : marker.lng}
      if (bounds.contains(coord) && ((this.activeFilters.includes(marker.category) && this.activeFilters.length > 0)|| this.activeFilters.length == 0)) {
        L.marker([marker.lat, marker.lng]).bindTooltip(marker.name+'<br>address : '+marker.address+'<br>Category : '+ marker.category).addTo(this.map);
      } else {
        this.map.removeLayer(coord);
      }
    })
    this.map.eachLayer((layer: L.Layer) => {
      if (layer instanceof L.Marker) {
        if (bounds.contains(layer.getLatLng())) {
          this.map.addLayer(layer);
        }else{
          this.map.removeLayer(layer);
        }
      }
    });
  }

  applyFilter(filter: string): void {
    // Vérifie si le filtre est déjà actif
    const index = this.activeFilters.indexOf(filter);

    if (index === -1) {
      // Ajoute le filtre à la liste s'il n'est pas déjà présent
      this.activeFilters.push(filter);
    } else {
      // Retire le filtre s'il est déjà actif
      this.activeFilters.splice(index, 1);
    }

    // Logique pour afficher/masquer les marqueurs en fonction des filtres actifs

    // Exemple : Supprimer tous les marqueurs de la carte
    this.map.eachLayer((layer: L.Layer) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });


    // Exemple : Ajouter les marqueurs correspondant aux filtres actifs
    this.listMarkers.forEach((marker) => {
      if (this.activeFilters.includes(marker.category) && this.map.getBounds().contains([marker.lat, marker.lng]) && this.activeFilters.length > 0) {
        L.marker([marker.lat, marker.lng]).bindTooltip(marker.name+'<br>address : '+marker.address+'<br>Category : '+ marker.category).addTo(this.map);
      }else if (this.activeFilters.length == 0 && this.map.getBounds().contains([marker.lat, marker.lng])) {
        L.marker([marker.lat, marker.lng]).bindTooltip(marker.name+'<br>address : '+marker.address+'<br>Category : '+ marker.category).addTo(this.map);
      }
    });
  }




}
