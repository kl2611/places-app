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
  public bounds: any;
  // public places: any; 
  public searchBox: any;

  public results: any[];
  public markers: any[];
  public filteredMarkers: any[];

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

    this.bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-122.5228, -122.3471),
      new google.maps.LatLng(37.7387, 37.8128)
    )

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Link search input to map
    var input = document.getElementById('search');
    this.searchBox = new google.maps.places.SearchBox(input, {
      bounds: this.bounds
    });


    // Create InfoWindow
    this.infowindow = new google.maps.InfoWindow();

    // Event Listener for map movement
    
    google.maps.event.addListener(this.map, 'idle', function() {
      console.log('idle event listener');
      // console.log(this.map.getBounds());
      // var bounds = this.map.getBounds();
      var input = document.getElementById('search');
      console.log('input', input);
      this.searchBox.setBounds(this.map.getBounds());
      this.filterPlaces();
      // console.log('getting new places', this.searchBox.getPlaces());
    }.bind(this));

    this.markers = [];

    // Event Listener for input places changed
    this.searchBox.addListener('places_changed', this.retrieveDetails.bind(this));

    this.bounds = new google.maps.LatLngBounds();
  }

  filterPlaces() {
    var bounds = this.map.getBounds();
    var filteredResults = [];
    this.filteredMarkers = [];
    for (var i = 0; i < this.markers.length; i++) {
      if (bounds.contains(this.markers[i].getPosition())) {
        // console.log(this.results[i]);
        this.filteredMarkers.push(this.markers[i]);
      }
    }

    console.log('filter markers', this.filteredMarkers);
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

    // Marker click event listener
    google.maps.event.addListener(marker, 'mouseenter', function() {
      // console.log('windowInfo', self);
      this.infowindow.setContent(place.name);
      this.infowindow.open(this.map, marker);
    }.bind(this));
  }

  selectMarker(i: number) {
    console.log('select marker', this.results[i]);
    this.infowindow.setContent('<div><strong>' + this.results[i].name + '</strong><br>' +
    this.results[i].formatted_address + '</div>');
    this.infowindow.open(this.map, this.markers[i]);
  }

  clearMarkers(markers: any[]) {
    this.markers.forEach(function(marker) {
      marker.setMap(null);
    });
    this.markers = [];
  }

  retrieveDetails() {
    var places = this.searchBox.getPlaces();

    console.log('places', places);
    this.results = places;

    if (!places.length) {
      console.log("Select a valid place");
      places = [];
      this.results =[];
      this.clearMarkers(this.markers);
    }

    if (places.length == 0) return;

    // Clear out the old markers.
    this.clearMarkers(this.markers);    
    // this.markers.forEach(function(marker) {
    //   marker.setMap(null);
    // });
    // this.markers = [];
    // var bounds = this.map.getBounds();
    this.bounds = new google.maps.LatLngBounds();
    console.log('this.bounds', this.bounds);
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place has no geometry");
        return;
      }

      // console.log('markers', this.markers)

      // Create a marker for each place.
      // console.log('this', this);
      var newMarker = new google.maps.Marker({
        map: this.map,
        title: place.name,
        position: place.geometry.location,
        // animation: google.maps.Animation.DROP
      });

      // Marker click event listener
      google.maps.event.addListener(newMarker, 'mouseover', function() {
        // console.log('windowInfo', self);
        this.infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
        place.formatted_address + '</div>');
        this.infowindow.open(this.map, newMarker);
      }.bind(this));

      this.markers.push(newMarker);

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        this.bounds.union(place.geometry.viewport);
      } else {
        this.bounds.extend(place.geometry.location);
      }
    }.bind(this));

    this.map.fitBounds(this.bounds);
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