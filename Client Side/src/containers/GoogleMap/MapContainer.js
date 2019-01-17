import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { connect } from 'react-redux';

import FullsizeMarker from '../FullsizeMarker/FullsizeMarker';
import Spinner from '../../components/Spinner/Spinner';

// main https://www.npmjs.com/package/google-maps-react
// https://scotch.io/tutorials/react-apps-with-the-google-maps-api-and-google-maps-react
// more details https://www.fullstackreact.com/articles/how-to-write-a-google-maps-react-component/#the-map-container-component

// some photo id 34454ef51b274bf1aadddb9a2a0d15c4
// http://localhost/webapplication1/api/numOfPhotos?neX=87.8672106462741&neY=178.78821655000002&swX=-76.289758795137&swY=-126.01647094999998&rad=0&centerX=0&centerY=0

const mapStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%'
}

const mapContainerStyle = {
  width: '100%',
  height: '90%'
}

class MapContainer extends Component {

  state = {
    map: {},
    showingModalWindow: false,  // hides or the shows the fullscreen Marker Modal
    activeMarker: {},
    markersArray: []
  };

  getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(userlocation => {
        const currentLatLng = {
          lat: userlocation.coords.latitude,
          lng: userlocation.coords.longitude
        }
        this.setState(() => ({ currentLatLng }))
      },
        (err) => { console.error('Navigator.geolocation error: ', err.message); },
        { timeout: 3000 }); // after 3 seconds without answer, call the error function above

    }
    else { console.log('Geolocation is not supported for this Browser/OS.'); }
  }

  onMapReady = (mapProps, map) => {
    // console.log("[MapContainer] > onMapReady");
    this.setState({ map: map, mapProps: mapProps }, () => { this.getGeoLocation(); });
  }

  onMapIdle = (mapProps, map) => {
    // console.log("​[MapContainer] > onMapIdle")

    let mapCenter = null;
    let mapBounds = null;
    let currRadius = this.props.radius; // from store ("global state")

    const mapParams = {};

    // this.getGeoLocation(); @@@@ MOVED TO componentDidMount @@@ NEED TO DECIDE IF IT KEEPS TRACKING USER's LOCATION OR ONLY ONCE

    if (map.getBounds() !== undefined && map.getCenter() !== undefined) {

      mapBounds = map.getBounds();
      // need to be tested and validate/disable radius slider
      mapCenter = this.state.currentLatLng ? this.state.currentLatLng : map.getCenter().toJSON();

      mapParams.neX = mapBounds.getNorthEast().toJSON().lat;
      mapParams.neY = mapBounds.getNorthEast().toJSON().lng;
      mapParams.swX = mapBounds.getSouthWest().toJSON().lat;
      mapParams.swY = mapBounds.getSouthWest().toJSON().lng;
      mapParams.rad = currRadius;
      mapParams.centerX = mapCenter.lat;
      mapParams.centerY = mapCenter.lng;

      this.getMarkers(mapParams);
    }

  }

  getMarkers = mapParams => {
    // console.log("​[MapContainer] -> mapParams", mapParams)
    // console.log('[MapContainer] > getMarkers > this.props.filtersArray:', this.props.filtersArray);
    console.log('[MapContainer] > getMarkers');


    axios('http://localhost/webapplication1/api/numOfPhotos/', { params: mapParams })
      .then((response) => {
        // console.table(response.data);
        const markers = response.data.filter(marker => this.props.filtersArray[marker.filters])
          .map((marker) => {
            return <Marker
              key={marker.id}
              markerId={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
              filter={marker.filters}
              title={"Filter: " + marker.filters}
              icon={{ url: 'http://localhost/webapplication1/api/image/thumbnail_' + marker.id }}
              onClick={this.onMarkerClick}
            />
          });
        this.setState({ markersArray: markers });
      })
      .catch((error) => console.error(error));

  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      activeMarker: marker,
      showingModalWindow: true
    });
  }

  toggleModal = () => {
    this.setState({
      showingModalWindow: !this.state.showingModalWindow,
      activeMarker: !this.state.showingModalWindow ? this.state.activeMarker : {}
    });
  }

  componentDidMount() {
    // console.log('[MapContainer] > componentDidMount');

    this.props.mapTriggerRef(this.triggerIdle);
  }

  // componentDidUpdate() { console.log('[MapContainer] > componentDidUpdate'); }

  triggerIdle = () => { this.onMapIdle(this.state.mapProps, this.state.map); }

  render() {
    // console.log('[MapContainer] render');

    if (!this.props.loaded) {
      return <Spinner />
    }

    return (

      <div>

        <Map
          google={this.props.google}
          style={mapStyle}
          containerStyle={mapContainerStyle}
          initialCenter={{ lat: 32.109333, lng: 34.855499 }} // Tel Aviv, Israel
          zoom={2}
          onReady={this.onMapReady}
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

// asks for props from store
const mapStateToProps = state => {
  // console.log("​[MapContainer] > mapStateToProps", state);
  return state;
}

export default connect(mapStateToProps)(GoogleApiWrapper({ apiKey: "AIzaSyBimObDCzrKYyVo9t9K1vZEqT7BmIvOCis" })(MapContainer))

Map.propTypes = {
  google: PropTypes.object,
  zoom: PropTypes.number,
  initialCenter: PropTypes.object,
  onClick: PropTypes.func,
  onReady: PropTypes.func,
  onIdle: PropTypes.func
}
