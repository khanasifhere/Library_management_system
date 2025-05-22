import { createSlice } from "@reduxjs/toolkit";
const popUpSlice = createSlice({
    name: "popUp",
    initialState: {
        settingPopUp: false,
        addBookPopUp: false,
        readBookPopUp: false,
        recordBookPopUp: false,
        returnBookPopUp: false,
        addNewAdminPopUp: false,},
    reducers: {
        toggleSettingPopUp: (state) => {
            state.settingPopUp = !state.settingPopUp;
        },
        toggleAddBookPopUp: (state) => {
            state.addBookPopUp = !state.addBookPopUp;
        },
        toggleReadBookPopUp: (state) => {
            state.readBookPopUp = !state.readBookPopUp;
        },
        toggleRecordBookPopUp: (state) => {
            state.recordBookPopUp = !state.recordBookPopUp;
        },
        toggleReturnBookPopUp: (state) => {
            state.returnBookPopUp = !state.returnBookPopUp;
        },
        toggleAddNewAdminPopUp: (state) => {
            state.addNewAdminPopUp = !state.addNewAdminPopUp;
        },
        closeAllPopUps: (state) => {
            state.settingPopUp = false;
            state.addBookPopUp = false;
            state.readBookPopUp = false;
            state.recordBookPopUp = false;
            state.returnBookPopUp = false;
            state.addNewAdminPopUp = false;
        },
    },
});
export const {closeAllPopUps,toggleAddBookPopUp,toggleAddNewAdminPopUp,toggleReadBookPopUp,toggleRecordBookPopUp,toggleReturnBookPopUp,toggleSettingPopUp} = popUpSlice.actions;
export default popUpSlice.reducer;