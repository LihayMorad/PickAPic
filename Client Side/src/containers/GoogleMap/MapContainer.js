import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { connect } from 'react-redux';

import FullsizeMarker from '../FullsizeMarker/FullsizeMarker';

// library https://www.npmjs.com/package/google-maps-react
// https://scotch.io/tutorials/react-apps-with-the-google-maps-api-and-google-maps-react
// more details https://www.fullstackreact.com/articles/how-to-write-a-google-maps-react-component/#the-map-container-component

const mapStyle = {
	position: 'absolute',
	width: '100%',
	height: '100%',
	boxShadow: '1px 1px 25px rgba(0, 0, 0, 0.35)'
}

const mapContainerStyle = {
	width: '100%',
	height: '90%'
}

class MapContainer extends Component {

	state = {
		map: {},
		showingModalWindow: false,
		showingInfoWindow: true,
		activeMarker: {},
		markersArray: []
	};

	getGeoLocation = () => {
		if (navigator.geolocation) {
			let watchID = navigator.geolocation.watchPosition(userlocation => {
				const currentLatLng = {
					lat: userlocation.coords.latitude,
					lng: userlocation.coords.longitude
				}
				this.setState({ currentLatLng, watchID: watchID });
			},
				(error) => { console.warn('Navigator.geolocation error: ', error.message); },
				{ timeout: 3000, enableHighAccuracy: true }); // after 3 seconds without answer, call the error function above
		}
		else { console.log('Geolocation is not supported for this Browser/OS.'); }
	}

	onMapReady = (mapProps, map) => { this.setState({ map: map, mapProps: mapProps }, () => { this.getGeoLocation(); }); }

	onMapIdle = (mapProps, map) => {

		let mapCenter = {};
		let mapBounds = {};
		let currRadius = this.props.radius;

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

		axios('http://localhost/webapplication1/api/numOfPhotos/', { params: mapParams })
			.then(response => {
				let userPhotosToShow = this.props.showOnlyCurrentUserPhotos ? this.props.loggedInUser : null;

				const markers = response.data.filter(marker => {
					return this.props.showOnlyCurrentUserPhotos && userPhotosToShow ?
						(this.props.filtersArray[marker.filters] && marker.username === userPhotosToShow)
						: this.props.filtersArray[marker.filters]
				})
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
			.catch(error => console.error(error));
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

	onInfoWindowClose = () => { this.setState({ showingInfoWindow: false }); }

	componentWillUnmount() { navigator.geolocation.clearWatch(this.state.watchID); }

	componentDidUpdate(prevProps) {
		if (prevProps.filtersArray !== this.props.filtersArray
			|| prevProps.radius !== this.props.radius
			|| prevProps.showOnlyCurrentUserPhotos !== this.props.showOnlyCurrentUserPhotos) {
			this.onMapIdle(this.state.mapProps, this.state.map);
		}
	}

	render() {

		return (

			<div>

				<Map
					google={this.props.google}
					style={mapStyle}
					containerStyle={mapContainerStyle}
					initialCenter={{ lat: 32.109333, lng: 34.855499 }}
					zoom={2}
					onClick={() => { this.onInfoWindowClose(); }}
					onReady={this.onMapReady}
					onIdle={this.onMapIdle}>

					{this.state.markersArray}

					<InfoWindow
						visible={this.state.showingInfoWindow}
						position={this.state.currentLatLng}
						onClose={this.onInfoWindowClose}>
						<h5>{"You are here!"}</h5>
					</InfoWindow>

				</Map>

				<FullsizeMarker
					isOpen={this.state.showingModalWindow}
					toggleModal={this.toggleModal}
					activeMarker={this.state.activeMarker}
					toggleIdle={() => { this.onMapIdle(this.state.mapProps, this.state.map) }} />

			</div>
		);

	}

}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(GoogleApiWrapper({ apiKey: "AIzaSyBimObDCzrKYyVo9t9K1vZEqT7BmIvOCis" })(MapContainer))

MapContainer.propTypes = {
	radius: PropTypes.number,
	filtersArray: PropTypes.object
}

Map.propTypes = {
	google: PropTypes.object,
	zoom: PropTypes.number,
	initialCenter: PropTypes.object,
	onClick: PropTypes.func,
	onReady: PropTypes.func,
	onIdle: PropTypes.func,
	style: PropTypes.object,
	containerStyle: PropTypes.object
}

InfoWindow.propTypes = {
	visible: PropTypes.bool,
	position: PropTypes.object,
	onClose: PropTypes.func
}

FullsizeMarker.propTypes = {
	isOpen: PropTypes.bool,
	toggleModal: PropTypes.func,
	activeMarker: PropTypes.object
}