import { Component, ElementRef, NgZone, OnInit, OnChanges, 
  SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
declare var google: any;
import {Observable} from 'rxjs/Rx';
import { FormControl } from '@angular/forms';
import { } from 'googlemaps';

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
  public searchBox: any;

  public results: any[];
  public markers: any[];
  public filteredMarkers: any[];
  public filteredResults: any[];

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
      zoom: 13,
      mapTypeId: 'roadmap'
    };

    this.markers = [];
    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Link search input to map
    var input = document.getElementById('search');

    // Create Searchbox
    this.searchBox = new google.maps.places.SearchBox(input);

    // Create Infowindow
    this.infowindow = new google.maps.InfoWindow();

    // Event Listener for map movement

    google.maps.event.addListener(this.map, 'idle', function() {
      console.log('idle event listener');

      var bounds = this.map.getBounds();
      this.searchBox.setBounds(bounds);
      this.filterPlaces();
    }.bind(this));

  this.markers = [];

  // Event Listener for input places changed
  google.maps.event.addListener(this.searchBox, 'places_changed', this.retrieveDetails.bind(this));

  this.bounds = new google.maps.LatLngBounds();
  }

  filterPlaces() {
    var bounds = this.map.getBounds();
    this.filteredResults = [];
    this.filteredMarkers = [];
    for (var i = 0; i < this.markers.length; i++) {
      if (bounds.contains(this.markers[i].getPosition())) {
        this.filteredMarkers.push(this.markers[i]);
        this.filteredResults.push(this.results[i]);
      }
    }
  }

  createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: this.map,
      title: place.name,
      position: place.geometry.location
    });

    this.markers.push(marker);
    console.log('markers', this.markers);

    // Marker click event listener
    google.maps.event.addListener(marker, 'mouseenter', function() {
      this.infowindow.setContent(place.name);
      this.infowindow.open(this.map, marker);
    }.bind(this));
  }

  selectMarker(i: number) {
    console.log('select marker', this.filteredResults[i]);
    this.infowindow.setContent('<div><strong>' + this.filteredResults[i].name + '</strong><br>' +
      this.filteredResults[i].formatted_address + '</div>');
    this.infowindow.open(this.map, this.filteredMarkers[i]);
  }

  clearMarkers(markers: any[]) {
    this.markers.forEach(function(marker) {
      marker.setMap(null); 
    });
    this.markers = [];
  }

  newSearch() {
    // Trigger search on button click
    this.searchBox.setBounds(this.map.getBounds());
    var input = document.getElementById('search');
    google.maps.event.trigger(input, 'focus');
    google.maps.event.trigger(input, 'keydown', {
      keyCode: 13
    })
  }

  retrieveDetails() {
    console.log('places changed');
    this.infowindow.close();
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

    this.bounds = new google.maps.LatLngBounds();
    console.log('this.bounds', this.bounds);
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place has no geometry");
        return;
      }

      var newMarker = new google.maps.Marker({
        map: this.map,
        title: place.name,
        position: place.geometry.location,
      });

      // Marker click event listener
      google.maps.event.addListener(newMarker, 'mouseover', function() {
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

}