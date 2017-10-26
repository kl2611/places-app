import { Component, ElementRef, NgZone, OnInit, AfterViewInit, ViewChild } from '@angular/core';
declare var google: any;
import { FormControl } from '@angular/forms';
import { } from 'googlemaps';
// import { AgmCoreModule, MapsAPILoader } from '@agm/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  public google: any;
  public map: any;
  public service: any;
  public infowindow: any;

  public results: any[];
  
  // @ViewChild("search")
  // public searchElementRef: ElementRef;

  // constructor(
  //   private mapsAPILoader: MapsAPILoader,
  //   private ngZone: NgZone
  // ) {}

  ngOnInit () {
    console.log('this is ', this);
    const initCoords = { lat: 37.7758, lng: -122.435 }; // this is SF
    const mapOptions = {
      center: initCoords, 
      zoom: 13
    };

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    this.infowindow = new google.maps.InfoWindow();
    this.service = new google.maps.places.PlacesService(this.map);
    this.service.textSearch({
      location: initCoords,
      radius: 500,
      query: 'restaurant'
    }, this.callback.bind(this));

    
  
    // The idle event is a debounced event, so we can query & listen without
    // throwing too many requests at the server.
    // this.map.addListener('idle', this.callback);
  }

  callback(results, status) {
    console.log(results);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        this.createMarker(place);
      }
    }
  }

  createMarker(place) {
    var self = this;
    // console.log('place', place);
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: this.map,
      position: place.geometry.location
    });


    // console.log(this.infowindow);

    google.maps.event.addListener(marker, 'click', function() {
      // console.log('windowInfo', self);
      self.infowindow.setContent(place.name);
      self.infowindow.open(self.map, marker);
    });
  }


  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }
}