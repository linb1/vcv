import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InitialStateTypes {
  nodeData: Object;
}

const initialState: InitialStateTypes = {
  nodeData: {},
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setNodeData: (state, action: PayloadAction<Object>) => {
      state.nodeData = action.payload;
    },
  },
});

export const { setNodeData } = globalSlice.actions;
export default globalSlice.reducer;
