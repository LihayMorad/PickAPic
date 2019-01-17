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
    }
}

const reducer = (state = initialState, action) => {

    // console.log("​[reducer]");

    switch (action.type) {
        case actionTypes.CHANGE_RADIUS:
            // console.log("[reducer] -> action.rad:", action.rad);
            return { ...state, radius: action.rad };
        case actionTypes.CHANGE_FILTERS:
            // console.log("[reducer] -> action.filterName, action.isChecked:", action.filterName, action.isChecked);
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
        default:
            return state;
    }
};

export default reducer;