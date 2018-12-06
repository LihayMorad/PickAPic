import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

import PropTypes from 'prop-types';
import axios from 'axios';

// main https://www.npmjs.com/package/google-maps-react
// https://scotch.io/tutorials/react-apps-with-the-google-maps-api-and-google-maps-react
// more details https://www.fullstackreact.com/articles/how-to-write-a-google-maps-react-component/#the-map-container-component

//Google map KEY AIzaSyBimObDCzrKYyVo9t9K1vZEqT7BmIvOCis

const mapStyle = {
  position: 'absolute',
  width: '100',
  height: '90%'
}

// 34454ef51b274bf1aadddb9a2a0d15c4
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

const pjs = {
  "neX": "87.8672106462741",
  "neY": "178.78821655000002",
  "swX": "-76.289758795137",
  "swY": "-126.01647094999998",
  "rad": "0",
  "centerX": "0",
  "centerY": "0",
}

class MapContainer extends Component {

  state = {
    showingInfoWindow: false,  //Hides or the shows the infoWindow
    activeMarker: {},          //Shows the active marker upon click
    markersArray: []
  };

  onIdle = (mapProps, map) => {
    // console.log('map: ', map);
    // console.log('map.center: ', map.center);
    // console.log('mapProps: ', mapProps);
    // console.log('mapProps.google.maps: ', mapProps.google.maps);

    // window.onresize = () => {
    //   console.log('window.onresize');
    //   const currCenter = map.getCenter();
    //   console.log('currCenter: ', currCenter);
    //   this.props.google.maps.event.trigger(map, 'resize');
    //   map.setCenter(currCenter);
    // };

    this.getMarkers();
  }

  getMarkers = (e) => {
    console.log('e: ', e);
    console.log("[getMarkers]");

    axios('http://localhost/webapplication1/api/numOfPhotos/', { params: pjs })
      .then((res) => {
        // console.log("[numOfPhotos] res:", res);
        // console.table(res.data);
        const markers = res.data.map((marker) => {
          return <Marker
            key={marker.id}
            id={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            filters={marker.filters}
            title={"Filter: " + marker.filters}
            icon={{
              url: 'http://localhost/webapplication1/api/image/thumbnail_' + marker.id
            }}
            onClick={this.onMarkerClick}
          />
        });
        this.setState({ markersArray: markers });
      })
      .catch((error) => console.log(error));

    // const imgID = "34454ef51b274bf1aadddb9a2a0d15c4";
    // axios('http://localhost/webapplication1/api/photodetails/' + imgID)
    //   .then((res) => {
    //     // console.log("[photodetails]res: ", res);
    //     console.table(res.data);
    //   });

  }

  onMarkerClick = (props, marker, e) => {
    console.log('[onMarkerClick]');

    // console.log('e: ', e);
    // console.log('marker: ', marker);
    // console.log('props: ', props);

    this.setState({
      activeMarker: marker,
      showingInfoWindow: true
    });

    // alert("marker clicked!");
  }

  onMapClicked = (props, marker, e) => {
    console.log('[onMapClicked]');

    // console.log('e: ', e);
    // console.log('marker: ', marker);
    // console.log('props: ', props);

    if (this.state.showingInfoWindow) {
      this.onInfoWindowClose();
    }
  }

  onInfoWindowClose = () => {
    console.log('[onInfoWindowClose]');

    if (this.state.showingInfoWindow) {

      this.setState({
        activeMarker: {},
        showingInfoWindow: false
      });

    }
  }

  render() {

    if (!this.props.loaded) {
      return <div className="container">Loading...</div>
    }

    return (

      <div>

        <Map
          google={this.props.google}
          style={mapStyle}
          initialCenter={{
            lat: 32.109333,
            lng: 34.855499
          }}
          zoom={3}
          onClick={this.onMapClicked}
          onReady={this.onIdle}
          onDragend={this.getMarkers}
          onIdle={this.idle}
          onCenterChanged={() => { this.props.google.maps.getCenter() }}
          onZoomChanged={() => { this.props.google.maps.getZoom() }}>

          {this.state.markersArray}

          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            onClose={this.onInfoWindowClose}>
            <div>
              <h2>{this.state.activeMarker.title}</h2>
            </div>
          </InfoWindow>
        </Map>

      </div>

    );

  }

}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBimObDCzrKYyVo9t9K1vZEqT7BmIvOCis'
})(MapContainer)

Map.propTypes = {
  google: PropTypes.object,
  zoom: PropTypes.number,
  initialCenter: PropTypes.object
}
