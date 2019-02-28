import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { connect } from 'react-redux';

import FullsizeMarker from '../FullsizeMarker/FullsizeMarker';

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

	onMapReady = (mapProps, map) => {
		// console.log("[MapContainer] > onMapReady");
		this.setState({ map: map, mapProps: mapProps }, () => { this.getGeoLocation(); });
	}

	onMapIdle = (mapProps, map) => {
		// console.log("​[MapContainer] > onMapIdle");

		let mapCenter = {};
		let mapBounds = {};
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
			// console.log(mapParams);

			this.getMarkers(mapParams);
		}

	}

	getMarkers = mapParams => {
		// console.log("​[MapContainer] -> mapParams", mapParams)
		// console.log('[MapContainer] > getMarkers > this.props.filtersArray:', this.props.filtersArray);
		// console.log('[MapContainer] > getMarkers');

		axios('http://localhost/webapplication1/api/numOfPhotos/', { params: mapParams })
			.then(response => {
				// console.table(response.data);
				// console.log(response.data);
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

	onInfoWindowClose = () => {
		this.setState({ showingInfoWindow: false });
	}

	componentDidMount() {
		// console.log('[MapContainer] > componentDidMount');
	}

	componentWillUnmount() {
		navigator.geolocation.clearWatch(this.state.watchID);
	}

	componentDidUpdate(prevProps, prevState) { // @@@@@@@@@@@@@@@@@@@@ NEED TO DO IT REDUX-STYLE, WHENEVER STORE CHANGE, TRIGGER IDLE
		if (prevProps.filtersArray !== this.props.filtersArray
			|| prevProps.radius !== this.props.radius
			|| prevProps.showOnlyCurrentUserPhotos !== this.props.showOnlyCurrentUserPhotos) {
			this.onMapIdle(this.state.mapProps, this.state.map);
		}
	}

	render() {
		// console.log('[MapContainer] render');

		return (

			<div>

				<Map
					google={this.props.google}
					style={mapStyle}
					containerStyle={mapContainerStyle}
					initialCenter={{ lat: 32.109333, lng: 34.855499 }}
					zoom={2}
					// bounds={bounds}
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

// asks for props from store
const mapStateToProps = state => {
	// console.log("​[MapContainer] > mapStateToProps", state);
	return state;
}

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