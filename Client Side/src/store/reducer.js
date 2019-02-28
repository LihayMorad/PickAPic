import * as actionTypes from './actions';

const initialState = {
    radius: 0,
    filtersArray: {
        'AllFilters': true,
        'Panorama': true,
        'Sunrise': true,
        'Sea': true,
        'River': true,
        'Grass': true,
        'Flowers': true,
        'Other': true,
    },
    loggedInUser: "",
    showOnlyCurrentUserPhotos: false
}

const reducer = (state = initialState, action) => {

    // console.log("​[reducer]");

    switch (action.type) {
        case actionTypes.CHANGE_RADIUS:
            return { ...state, radius: action.rad };
        case actionTypes.CHANGE_FILTERS:
            const updatedFiltersArray = { ...state.filtersArray };
            if (action.filterName === "AllFilters") {
                for (const filter in state.filtersArray) { updatedFiltersArray[filter] = action.isChecked; }
            }
            else {
                let checked = 0;
                updatedFiltersArray[action.filterName] = action.isChecked;
                for (const filter in updatedFiltersArray) {
                    if (filter !== "AllFilters" && updatedFiltersArray[filter]) { checked++; }
                }
                updatedFiltersArray["AllFilters"] = checked === 7 ? true : false;
            }
            const updatedState = { ...state, filtersArray: updatedFiltersArray };
            return updatedState;
        case actionTypes.CHANGE_LOGGED_IN_USER:
            return { ...state, loggedInUser: action.username };
        case actionTypes.CHANGE_PHOTOS_TO_SHOW:
            return { ...state, showOnlyCurrentUserPhotos: action.isChecked };
        default:
            return state;
    }
};

export default reducer;