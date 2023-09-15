import { useSelector, useDispatch } from 'react-redux'
import Table from 'react-bootstrap/Table';
import Chart from 'react-apexcharts';
import { ethers } from 'ethers'

import { options, series } from './Charts.config';
import { chartSelector } from '../store/selectors';
import { useEffect } from 'react'

import dappIcon from '../dapp-swap.png';
import appleIcon from '../apple.jpeg';

import Loading from './Loading';
import Swap from './Swap';

import {
  loadAllSwaps
} from '../store/interactions'

const Charts = () => {
  const provider = useSelector(state => state.provider.connection)

  const tokens = useSelector(state => state.tokens.contracts)
  const symbols = useSelector(state => state.tokens.symbols)

  const flagDapp = 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
  const flagApple = 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
 
  // const amm = useSelector(state => state.amm.contract)
  const amm = useSelector(state => state.amm.contract)
  const activeAMM = useSelector(state => state.amm.contract.address)

  const chart = useSelector(chartSelector)

  const dispatch = useDispatch()

  useEffect(() => {
    if(provider && amm) {
      loadAllSwaps(provider, amm, dispatch)
    }
  }, [provider, amm, dispatch])

  return (
    <div>

        { activeAMM == flagDapp && (
    <h5 className='d-flex justify-content-center align-items-center my-3'>Routing: DappSwap
        <img
        alt="dappswap"
        src={dappIcon}
        width="40"
        height="40"
        className="align-right mx-3"
        />
    </h5>

      )}

        { activeAMM == flagApple && (
    <h5 className='d-flex justify-content-center align-items-center my-3'>Routing: Appleswap
        <img
        alt="appleswap"
        src={appleIcon}
        width="40"
        height="40"
        className="align-right mx-3"
        />
    </h5>
      )}
      {provider && amm ? (
        <div>
          <Chart
            type="line"
            options={options}
            series={chart ? chart.series : series}
            width="100%"
            height="100%"
          />

          <hr />

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Transaction Hash</th>
                <th>Token Give</th>
                <th>Amount Give</th>
                <th>Token Get</th>
                <th>Amount Get</th>
                <th>User</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {chart.swaps && chart.swaps.map((swap, index) => (
                <tr key={index}>
                  <td>{swap.hash.slice(0, 5) + '...' + swap.hash.slice(61, 66)}</td>
                  <td>{swap.args.tokenGive === tokens[0].address ? symbols[0] : symbols[1]}</td>
                  <td>{ethers.utils.formatUnits(swap.args.tokenGiveAmount.toString(), 'ether')}</td>
                  <td>{swap.args.tokenGet === tokens[0].address ? symbols[0] : symbols[1]}</td>
                  <td>{ethers.utils.formatUnits(swap.args.tokenGetAmount.toString(), 'ether')}</td>
                  <td>{swap.args.user.slice(0, 5) + '...' + swap.args.user.slice(38, 42)}</td>
                  <td>{
                    new Date(Number(swap.args.timestamp.toString() + '000'))
                      .toLocaleDateString(
                        undefined,
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          second: 'numeric'
                        }
                      )
                  }</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

      ) : (
        <Loading/>
      )}

    </div>

  );
}

export default Charts;








