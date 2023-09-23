import { createSlice } from '@reduxjs/toolkit'

export const amm = createSlice({
  name: 'amm',
  initialState: {
    contract: null,
    shares: 0,
    swaps: [],
    depositing: {
      isDepositing: false,
      isSucccess: false,
      transactionHash: null
    },
    withdrawing: {
      isWithdrawing: false,
      isSucccess: false,
      transactionHash: null
    },
    swapping: {
      isSwapping: false,
      isSucccess: false,
      transactionHash: null
    }
  },
  reducers: {
    setContract: (state, action) => {
      state.contract = action.payload
    },
    setContract1: (state, action) => {
      state.contract = action.payload
    },
    sharesLoaded: (state, action) => {
      state.shares = action.payload
    },

    token1Loaded: (state, action) => {
      state.token1 = action.payload
    },

    token2Loaded: (state, action) => {
      state.token2 = action.payload
    },

    token3Loaded: (state, action) => {
      state.token3 = action.payload
    },

    token4Loaded: (state, action) => {
      state.token4 = action.payload
    },

    token5Loaded: (state, action) => {
      state.token5 = action.payload
    },

    token6Loaded: (state, action) => {
      state.token4 = action.payload
    },

    dappDappApple1Loaded: (state, action) => {
      state.dappDappApple1 = action.payload
    },

    dappDappApple2Loaded: (state, action) => {
      state.dappDappApple2 = action.payload
    },

    appleDappApple1Loaded: (state, action) => {
      state.appleDappApple1 = action.payload
    },

    appleDappApple2Loaded: (state, action) => {
      state.appleDappApple2 = action.payload
    },

    swapsLoaded: (state, action) => {
      state.swaps = action.payload
    },
    depositRequest: (state, action) => {
      state.depositing.isDepositing = true
      state.depositing.isSuccess = false
      state.depositing.transactionHash = null
    },
    depositSuccess: (state, action) => {
      state.depositing.isDepositing = false
      state.depositing.isSuccess = true
      state.depositing.transactionHash = action.payload
    },
    depositFail: (state, action) => {
      state.depositing.isDepositing = false
      state.depositing.isSuccess = false
      state.depositing.transactionHash = null
    },
    withdrawRequest: (state, action) => {
      state.withdrawing.isWithdrawing = true
      state.withdrawing.isSuccess = false
      state.withdrawing.transactionHash = null
    },
    withdrawSuccess: (state, action) => {
      state.withdrawing.isWithdrawing = false
      state.withdrawing.isSuccess = true
      state.withdrawing.transactionHash = action.payload
    },
    withdrawFail: (state, action) => {
      state.withdrawing.isWithdrawing = false
      state.withdrawing.isSuccess = false
      state.withdrawing.transactionHash = null
    },
    swapRequest: (state, action) => {
      state.swapping.isSwapping = true
      state.swapping.isSuccess = false
      state.swapping.transactionHash = null
    },
    swapSuccess: (state, action) => {
      state.swapping.isSwapping = false
      state.swapping.isSuccess = true
      state.swapping.transactionHash = action.payload
    },
    swapFail: (state, action) => {
      state.swapping.isSwapping = false
      state.swapping.isSuccess = false
      state.swapping.transactionHash = null
    }
  }
})

export const {
  setContract,
  setContract1,
  sharesLoaded,
  token1Loaded,
  token2Loaded,
  token3Loaded,
  token4Loaded,
  token5Loaded,
  dappDappApple1Loaded,
  dappDappApple2Loaded,
  appleDappApple1Loaded,
  appleDappApple2Loaded,
  swapsLoaded,
  depositRequest,
  depositSuccess,
  depositFail,
  withdrawRequest,
  withdrawSuccess,
  withdrawFail,
  swapRequest,
  swapSuccess,
  swapFail
} = amm.actions;

export default amm.reducer;
