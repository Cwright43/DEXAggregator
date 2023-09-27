import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Container } from 'react-bootstrap'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Collapse from 'react-bootstrap/Collapse';
import { ethers } from 'ethers'

import dappIcon from '../dapp-swap.png';
import appleIcon from '../apple.jpeg';


import Alert from './Alert'

import {
  swap,
  loadProvider,
  loadBalances,
  loadBalances1,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadAMM,
  loadApple,
  loadDapp
} from '../store/interactions'

const Swap = ({ price1, price2, chainId, }) => {

  const [inputToken, setInputToken] = useState(null)
  const [outputToken, setOutputToken] = useState(null)
  const [inputAmount, setInputAmount] = useState(0)
  const [outputAmount, setOutputAmount] = useState(0)

  const [flagDapp, setFlagDapp] = useState(false)
  const [flagApple, setFlagApple] = useState(false)

  const [price, setPrice] = useState(0)

  const [activeAMM, setActiveAMM] = useState(0)

  const [showAlert, setShowAlert] = useState(false)

  const provider = useSelector(state => state.provider.connection)
  const account = useSelector(state => state.provider.account)

  const tokens = useSelector(state => state.tokens.contracts)
  const symbols = useSelector(state => state.tokens.symbols)
  const balances = useSelector(state => state.tokens.balances)

  const amm = useSelector(state => state.amm.contract)
  const isSwapping = useSelector(state => state.amm.swapping.isSwapping)
  const isSuccess = useSelector(state => state.amm.swapping.isSuccess)
  const transactionHash = useSelector(state => state.amm.swapping.transactionHash)

  const dispatch = useDispatch()

  const inputHandler = async (e) => {
    if (!inputToken || !outputToken) {
      window.alert('Please select token')
      return
    }

    if (inputToken === outputToken) {
      window.alert('Invalid token pair')
      return
    }

    if (e.target.value == 0) {
      setFlagApple(false)
      setFlagDapp(false)
      return
    }

    if (inputToken === 'DAPP') {
      setInputAmount(e.target.value)

      const _token1AmountA = ethers.utils.parseUnits(e.target.value, 'ether')
      // const result = await amm.calculateToken1Swap(_token1Amount)
      const _token1Amount = ethers.utils.formatUnits(_token1AmountA.toString(), 'ether')

      

      if (price1 > price2) {
        await loadApple(provider, chainId, dispatch)
        const output = _token1Amount * price1
        setOutputAmount(output)
        console.log("AppleSwap WINS")
        console.log(`GAAAY`)
        setPrice(price1)
        setFlagApple(true)
      } else {
        await loadDapp(provider, chainId, dispatch)
        const output = _token1Amount * price2
        setOutputAmount(output)
        console.log("DappSwap WINS")
        console.log(`UBER GAY${amm.address}`)
        setPrice(price2)
        setFlagDapp(true)
      }

    

    } else {
      setInputAmount(e.target.value)

      const _token1AmountA = ethers.utils.parseUnits(e.target.value, 'ether')
      // const result = await amm.calculateToken1Swap(_token1Amount)
      const _token1Amount = ethers.utils.formatUnits(_token1AmountA.toString(), 'ether')

     // setOutputAmount(_token1Amount.toString())
    
      if (price2 > price1) {
        await loadApple(provider, chainId, dispatch)
        console.log("AppleSwap WINS")
        const output = _token1Amount * (1 / price1)
        setOutputAmount(output)
        setPrice(1 / price1)
        setFlagApple(true)
      } else {
        await loadDapp(provider, chainId, dispatch)
        const output = _token1Amount * (1 / price2)
        setOutputAmount(output)
        console.log("DappSwap WINS")
        setPrice(1 / price2)
        setFlagDapp(true)
      }

    }

  }

  const swapHandler = async (e) => {
    e.preventDefault()

    setShowAlert(false)

    if (inputToken === outputToken) {
      window.alert('Invalid Token Pair')
      return
    }

    const _inputAmount = ethers.utils.parseUnits(inputAmount, 'ether')

    // Swap token depending upon which one we're doing...
    if (inputToken === "DAPP") {
      await swap(provider, amm, tokens[0], inputToken, _inputAmount, dispatch)
    } else {
      await swap(provider, amm, tokens[1], inputToken, _inputAmount, dispatch)
    }

    await loadBalances(amm, tokens, account, dispatch)
    await getPrice()

    setShowAlert(true)

  }

  const getPrice = async () => {
    if (inputToken === outputToken) {
      setPrice(0)
      return
    }

    if (inputToken === 'DAPP') {
      setPrice(await amm.token2Balance() / await amm.token1Balance())
    } else {
      setPrice(await amm.token1Balance() / await amm.token2Balance())
    }
  }

  useEffect(() => {
    if(inputToken && outputToken) {
      getPrice()
    }
  }, [inputToken, outputToken]);

  return (
    <div>

    <Row className='mtext-center'>
      {flagDapp && (
    <h5 className='d-flex justify-content-center align-items-center text-warning my-3 body rounded-5'>
        Routing: DappSwap
        <img
        alt="dappswap"
        src={dappIcon}
        width="40"
        height="40"
        className="align-center mx-3"
        />
    </h5>

      )}

      {flagApple && (
    <h5 className='d-flex justify-content-center align-items-center text-warning my-3 body rounded-5'
>
      Routing: Appleswap
        <img
        alt="appleswap"
        src={appleIcon}
        width="40"
        height="40"
        className="text-center mx-3 rounded-circle"
        />
    </h5>
      )}
</Row>
<Row>
      <Card style={{ maxWidth: '450px' }} className='mx-auto px-4'>
        {account ? (
          <Form onSubmit={swapHandler} style={{ maxWidth: '450px', margin: '50px auto' }}>

            <Row className='my-3'>
              <div className='d-flex justify-content-between'>
                <Form.Label><strong>Input: </strong></Form.Label>
                <Form.Text muted>
                  Balance: {
                    inputToken === symbols[0] ? (
                      parseFloat(balances[0]).toFixed(2)
                    ) : inputToken === symbols[1] ? (
                      parseFloat(balances[1]).toFixed(2)
                    ) : 0
                  }
                </Form.Text>
              </div>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="0.0"
                  min="0.0"
                  step="any"
                  onChange={(e) => inputHandler(e) }
                  disabled={!inputToken}
                />
                <DropdownButton
                  variant="outline-secondary"
                  title={inputToken ? inputToken : "Select Token"}
                >

                  <Dropdown.Item onClick={(e) => setInputToken(e.target.innerHTML)} >DAPP</Dropdown.Item>
                  <Dropdown.Item onClick={(e) => setInputToken(e.target.innerHTML)} >USD</Dropdown.Item>
                </DropdownButton>
              </InputGroup>
            </Row>

            <Row className='my-4'>
              <div className='d-flex justify-content-between'>
                <Form.Label><strong>Output:</strong></Form.Label>
                <Form.Text muted>
                  Balance: {
                    outputToken === symbols[0] ? (
                      parseFloat(balances[0]).toFixed(2)
                    ) : outputToken === symbols[1] ? (
                      parseFloat(balances[1]).toFixed(2)
                    ) : 0
                  }
                </Form.Text>
              </div>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="0.0"
                  value={outputAmount === 0 ? "" : outputAmount }
                  disabled
                />
                <DropdownButton
                  variant="outline-secondary"
                  title={outputToken ? outputToken : "Select Token"}
                >
                  <Dropdown.Item onClick={(e) => setOutputToken(e.target.innerHTML)}>DAPP</Dropdown.Item>
                  <Dropdown.Item onClick={(e) => setOutputToken(e.target.innerHTML)}>USD</Dropdown.Item>
                </DropdownButton>
              </InputGroup>
            </Row>

            <Row className='my-3'>
              {isSwapping ? (
                <Spinner animation="border" style={{ display: 'block', margin: '0 auto' }} />
              ): (
                <Button type='submit'>Swap</Button>
              )}

              <Form.Text muted>
                <p>Exchange Rate: {price}</p>
              </Form.Text>
            </Row>

          </Form>

        ) : (
          <p
            className='d-flex justify-content-center align-items-center'
            style={{ height: '300px' }}
          >
            Please connect wallet.
          </p>
        )}
      </Card>



      {isSwapping ? (
        <Alert
          message={'Swap Pending...'}
          transactionHash={null}
          variant={'info'}
          setShowAlert={setShowAlert}
        />
      ) : isSuccess && showAlert ? (
        <Alert
          message={'Swap Successful'}
          transactionHash={transactionHash}
          variant={'success'}
          setShowAlert={setShowAlert}
        />
      ) : !isSuccess && showAlert ? (
        <Alert
          message={'Swap Failed'}
          transactionHash={null}
          variant={'danger'}
          setShowAlert={setShowAlert}
        />
      ) : (
        <></>
      )}
</Row>
    </div>
  );
}

export default Swap;

