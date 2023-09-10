import { createSlice } from '@reduxjs/toolkit'

export const appleswap = createSlice({
  name: 'appleswap',
  initialState: {
    contract: null,
    shares: 0,
    swaps: [],
    swapping: {
      isSwapping: false,
      isSucccess: false,
      transactionHash: null
    }
  },
  reducers: {
    setContract1: (state, action) => {
      state.contract = action.payload
    },
    sharesLoaded: (state, action) => {
      state.shares = action.payload
    },
    tokenALoaded: (state, action) => {
      state.tokenA = action.payload
    },
    tokenBLoaded: (state, action) => {
      state.tokenB = action.payload
    },
  }
})

export const {
  setContract1,
  sharesLoaded,
  tokenALoaded,
  tokenBLoaded,
} = appleswap.actions;

export default appleswap.reducer;
