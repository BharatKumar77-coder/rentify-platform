import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axiosConfig';

const initialState = {
  items: [],
  selectedItem: null, 
  isLoading: false,
  isError: false,
  message: '',
};

// Fetch All Equipment
export const getEquipment = createAsyncThunk(
  'equipment/getAll', 
  async (keyword = '', thunkAPI) => { 
    try {      
      let url = '/equipment';
      if (keyword) {
        url = `/equipment?keyword=${keyword}`;
      }

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const equipmentSlice = createSlice({
  name: 'equipment',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEquipment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEquipment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(getEquipment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = equipmentSlice.actions;
export default equipmentSlice.reducer;