import { useSelector, useDispatch } from 'react-redux'
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Blockies from 'react-blockies'

import logo from '../logo.jpg';

import { loadProvider,
         loadAccount, 
         loadBalances,
         loadDaiWethBalances,
         loadAggregator,
        } from '../store/interactions'

import config from '../config.json'

const Navigation = ({ provider }) => {
  const chainId = useSelector(state => state.provider.chainId)
  const account = useSelector(state => state.provider.account)
  const tokens = useSelector(state => state.tokens.contracts)
  const amm = useSelector(state => state.amm.contract)

  const dispatch = useDispatch()

  const connectHandler = async () => {
    const provider = await loadProvider(dispatch)
    const account = await loadAccount(dispatch)
    const aggregator = await loadAggregator(provider, chainId, dispatch)
    await loadBalances(amm, tokens, account, dispatch)
    await loadDaiWethBalances(aggregator, dispatch)
  }

  const networkHandler = async (e) => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: e.target.value }],
    })
  }

  return (
    <Navbar className='my-3 bg-primary ' expand="lg">
      <img
        alt="logo"
        src={logo}
        width="75"
        height="50"
        className="d-inline-block align-top mx-3"
      />
      <Navbar.Brand href="#" className='text-warning'><strong>Turbo Shell Aggregator</strong></Navbar.Brand>

      <Navbar.Toggle aria-controls="nav" />
      <Navbar.Collapse id="nav" className="justify-content-end">

        <div className="d-flex justify-content-end mt-3">

          <Form.Select
            aria-label="Network Selector"
            value={config[chainId] ? `0x${chainId.toString(16)}` : `0`}
            onChange={networkHandler}
            style={{ maxWidth: '200px', marginRight: '20px' }}
          >
            <option value="0" disabled>Select Network</option>
            <option value="0x7A69">Localhost</option>
            <option value="0x5">Goerli</option>
            <option value="0x1">Mainnet</option>
            <option value="0xaa36a7">Sepolia</option>
            <option value="0xe708">Linea</option>
            <option value="0x61">BSC Testnet</option>
            <option value="0x13881">Mumbai</option>
          </Form.Select>

          {account ? (
            <Navbar.Text className='d-flex align-items-center text-warning'>
              {account.slice(0, 5) + '...' + account.slice(38, 42)}
              <Blockies
                seed={account}
                size={10}
                scale={3}
                color="#2187D0"
                bgColor="#F1F2F9"
                spotColor="#767F92"
                className="identicon mx-2"
              />
            </Navbar.Text>
          ) : (
            <Button onClick={connectHandler}>Connect</Button>
          )}

        </div>

      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
