import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import FullsizeMarker from '../FullsizeMarker/FullsizeMarker';

import { getRadius } from '../../components/Toolbar/RadiusSlider/RadiusSlider';

// main https://www.npmjs.com/package/google-maps-react
// https://scotch.io/tutorials/react-apps-with-the-google-maps-api-and-google-maps-react
// more details https://www.fullstackreact.com/articles/how-to-write-a-google-maps-react-component/#the-map-container-component

//Google map KEY AIzaSyBimObDCzrKYyVo9t9K1vZEqT7BmIvOCis
// some photo id 34454ef51b274bf1aadddb9a2a0d15c4
// http://localhost/webapplication1/api/numOfPhotos?neX=87.8672106462741&neY=178.78821655000002&swX=-76.289758795137&swY=-126.01647094999998&rad=0&centerX=0&centerY=0

// const paramss = new URLSearchParams();
// paramss.append("neX", "87.8672106462741");
// paramss.append("neY", "178.78821655000002");
// paramss.append("swX", "-76.289758795137");
// paramss.append("swY", "-126.01647094999998");
// paramss.append("rad", "0");
// paramss.append("centerX", "0");
// paramss.append("centerY", "0");
// console.log('paramss: ', paramss.toString());

const mapStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%'
}

const mapContainerStyle = {
  width: '100%',
  height: '90%'
}

let currLat;
let currLng;

class MapContainer extends Component {

  state = {
    showingModalWindow: false,  // hides or the shows the fullscreen Marker Modal
    activeMarker: {},
    markersArray: []
  };

  getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(userlocation => {
        this.setState(prevState => ({
          currentLatLng: {
            ...prevState.currentLatLng,
            lat: userlocation.coords.latitude,
            lng: userlocation.coords.longitude
          }
        }))
        currLat = userlocation.coords.latitude;
        currLng = userlocation.coords.longitude;
      }
      )
    }
  }

  onMapIdle = (mapProps, map) => {

    let mapCenter = null;
    let mapBounds = null;
    const mapParams = {};

    this.getGeoLocation();

    if (map.getBounds() !== undefined && map.getCenter() !== undefined) {

      mapBounds = map.getBounds();
      mapCenter = map.getCenter().toJSON();

      mapParams.neX = mapBounds.getNorthEast().toJSON().lat;
      mapParams.neY = mapBounds.getNorthEast().toJSON().lng;
      mapParams.swX = mapBounds.getSouthWest().toJSON().lat;
      mapParams.swY = mapBounds.getSouthWest().toJSON().lng;

      mapParams.rad = getRadius();

      mapParams.centerX = mapCenter.lat;
      mapParams.centerY = mapCenter.lng;

      this.getMarkers(mapParams);
    }

  }

  getMarkers = mapParams => {
    // console.log("[getMarkers]");

    axios('http://localhost/webapplication1/api/numOfPhotos/', { params: mapParams })
      .then((response) => {
        // console.log("[numOfPhotos] res:", res);
        // console.table(res.data);
        const markers = response.data.map((marker) => {

          if (this.areSearchCoordinatesWithinRadius(currLat, currLng, marker.lat, marker.lng, getRadius()) || getRadius() === 0) {

            return <Marker
              key={marker.id}
              markerId={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
              filters={marker.filters}
              title={"Filter: " + marker.filters}
              icon={{
                url: 'http://localhost/webapplication1/api/image/thumbnail_' + marker.id
              }}
              onClick={this.onMarkerClick}
            />
          }
        });
        this.setState({ markersArray: markers });
      })
      .catch((error) => console.log(error));

  }

  areSearchCoordinatesWithinRadius = (a, b, x, y, r) => {
    let dist = (a - x) * (a - x) + (a - y) * (a - y);
    r *= r;
    if (dist < r) {
      return true;
    }
    return false;
  }

  onMarkerClick = (props, marker, e) => {
    // console.log('[onMarkerClick]');

    // console.log('e: ', e);
    // console.log('marker: ', marker);
    // console.log('props: ', props);

    this.setState({
      activeMarker: marker,
      showingModalWindow: true
    });


    // alert("marker clicked!");
  }

  toggleModal = () => {
    console.log('[MapContainer] toggleModal');

    this.setState({
      showingModalWindow: !this.state.showingModalWindow,
      activeMarker: !this.state.showingModalWindow ? this.state.activeMarker : {}
    });

  }

  // componentWillUpdate() {
  //   console.log('[MapContainer] componentWillUpdate');
  // }

  // componentDidUpdate() {
  //   console.log('[MapContainer] componentDidUpdate');
  // }

  render() {
    console.log('[MapContainer] render');

    if (!this.props.loaded) {
      return <p>Loading...</p>
    }

    return (

      <div>

        <Map
          google={this.props.google}
          style={mapStyle}
          containerStyle={mapContainerStyle}
          initialCenter={{ lat: 32.109333, lng: 34.855499 }} // Tel Aviv, Israel
          zoom={2}
          onReady={this.onMapIdle}
          onIdle={this.onMapIdle}>

          {this.state.markersArray}

        </Map>

        <FullsizeMarker
          isOpen={this.state.showingModalWindow}
          toggleModal={this.toggleModal}
          activeMarker={this.state.activeMarker} />

      </div>
    );

  }

}

export const updateMap = () => {
  return (MapContainer.onMapIdle)
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBimObDCzrKYyVo9t9K1vZEqT7BmIvOCis'
})(MapContainer)

Map.propTypes = {
  google: PropTypes.object,
  zoom: PropTypes.number,
  initialCenter: PropTypes.object,
  onClick: PropTypes.func,
  onReady: PropTypes.func,
  onIdle: PropTypes.func
}
