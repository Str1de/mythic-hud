export const initialState = {
    showing: false,
    current: 0,
    reserve: 0,
    weaponLabel: '',
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_AMMO':
            return {
                ...state,
                showing: true,
                current: action.payload.current,
                reserve: action.payload.reserve,
                weaponLabel: action.payload.weaponLabel || state.weaponLabel,
            };
        case 'HIDE_AMMO':
            return {
                ...initialState,
            };
        default:
            return state;
    }
};
