import { Component, ElementRef, NgZone, OnInit, OnChanges, 
         SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
declare var google: any;
import {Observable} from 'rxjs/Rx';
import { FormControl } from '@angular/forms';
import { } from 'googlemaps';
// import { AgmCoreModule, MapsAPILoader } from '@agm/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public searchControl: FormControl;

  public map: any;
  public service: any;
  public infowindow: any;
  // public places: any; 
  public searchBox: any;

  public results: any[];
  public markers: any[];

  constructor(private ref: ChangeDetectorRef) {
    setInterval(() => {
      this.ref.detectChanges();
    }, 500)
  }

  ngOnInit () {
    this.results = [];
    const initCoords = { lat: 37.7758, lng: -122.435 }; // default is SF
    const mapOptions = {
      center: initCoords, 
      zoom: 13
    };

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Link search input to map
    var input = document.getElementById('search');
    this.searchBox = new google.maps.places.SearchBox(input);

    // Create InfoWindow
    this.infowindow = new google.maps.InfoWindow();

    // Places Service
    // this.service = new  google.maps.places.PlacesService(this.map);
    // this.service.textSearch({
    //   location: initCoords,
    //   radius: 500,
    //   query: 'restaurant'
    // }, this.callback.bind(this));  

    // Search results will be within map bounds
    this.map.addListener('bounds_changed', function() {
      this.searchBox.setBounds(this.map.getBounds());
    }.bind(this));

    this.markers = [];

    // Places Changed
    this.searchBox.addListener('places_changed', this.retrieveDetails.bind(this));

    var bounds = new google.maps.LatLngBounds();
  }

  // callback(results, status) {
  //   // console.log(results);
  //   console.log('callback invoked', results);
  //   this.results = results;
  //   if (status === google.maps.places.PlacesServiceStatus.OK) {
  //     for (var i = 0; i < results.length; i++) {
  //       var place = results[i];
  //       this.createMarker(place);
  //     }
  //   }
  // }

  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log('changes', changes);
  //   if (changes['results']) {
  //     console.log('changes in results', this.results);
  //   }
  // }

  createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: this.map,
      title: place.name,
      position: place.geometry.location
    });

    this.markers.push(marker);
    console.log('markers', this.markers);

    // console.log(this.infowindow);

    google.maps.event.addListener(marker, 'click', function() {
      // console.log('windowInfo', self);
      this.infowindow.setContent(place.name);
      this.infowindow.open(this.map, marker);
    }.bind(this));
  }

  // onSubmit(query: string) {
  //   console.log('new query', query);
  //   // this.renderMap(query);
  // }

  retrieveDetails() {
    console.log('searchbox', this.searchBox);
    console.log('retrieving details', this.markers);
    var places = this.searchBox.getPlaces();

    console.log('places', places);
    if (!places) {
      console.log("Select a valid place");
      places = [];
    }

    if (places.length == 0) return;

    // Clear out the old markers.
    
    this.markers.forEach(function(marker) {
      marker.setMap(null);
    });
    this.markers = [];

    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place has no geometry");
        return;
      }

      // var icon = {
      //   url: place.icon,
      //   size: new google.maps.Size(71, 71),
      //   origin: new google.maps.Point(0, 0),
      //   anchor: new google.maps.Point(17, 34),
      //   scaledSize: new google.maps.Size(25, 25)
      // }

      // console.log('markers', this.markers)

      // Create a marker for each place.
      // console.log('this', this);
      var newMarker = new google.maps.Marker({
        map: this.map,
        title: place.name,
        position: place.geometry.location
      });

      google.maps.event.addListener(newMarker, 'click', function() {
        // console.log('windowInfo', self);
        this.infowindow.setContent(place.name);
        this.infowindow.open(this.map, newMarker);
      }.bind(this));

      this.markers.push(newMarker);

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    }.bind(this));

    this.map.fitBounds(bounds);
  }


  // private setCurrentPosition() {
  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.latitude = position.coords.latitude;
  //       this.longitude = position.coords.longitude;
  //       this.zoom = 12;
  //     });
  //   }
  // }
}