import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "search",
  initialState: {
    isModalVisible: false,
    accessList: []
    },
  reducers: {
    openModal: (state) => {
      state.isModalVisible = true;
    },
    closeModal: (state) => {
      state.isModalVisible = false;
    },
    getAccess: (state) => {
      state.accessList = [];
    },
    getAccessSuccess: (state, {payload}) => {
      state.accessList = payload;
    },
    getAccessFailed: (state) => {
      state.accessList = [];
    }
  },
});

export default modalSlice;
