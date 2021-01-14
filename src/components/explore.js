import axios from 'axios';
import React, {useState, useEffect} from 'react'
import logo2 from '../assets/loading.gif'

export default function Explore(props){

    const [swaps, setSwaps] = useState([])
    const [joins, setJoins] = useState([])
    const [others, setOthers] = useState([])
    const [loading, setLoading] = useState(false)

    const newapi = async() => {
        let url = `https://api.covalenthq.com/v1/apps/@covalent-3/balancer_insights/swapv1/?key=${process.env.REACT_APP_COVALENT_KEY}&page-size=3000`
        const response = await axios.get(url)
        console.log('swapsv1', response)
        console.log('log-swaps', swaps)
        console.log('others', others)
    }

    useEffect(() => {
        async function getBlockHeight() {
            let blockheighturl = `https://api.covalenthq.com/v1/1/block_v2/latest/?key=${process.env.REACT_APP_COVALENT_KEY}`
            const blkheight = await axios.get(blockheighturl)
            const height = blkheight.data.data.items[0].height
            console.log(height)
            // ending block value must be higher than starting block 
            let logcontracturl = `https://api.covalenthq.com/v1/1/events/address/${process.env.REACT_APP_BALANCER_DAIETH_LP}/?starting-block=${(height-50000)}&ending-block=${(height+100)}&page-size=3000&key=${process.env.REACT_APP_COVALENT_KEY}`
            const response = await axios.get(logcontracturl)

            // console.log(response)
            const lastweek = new Date(Date.now() - 604800000)
            const filteredtime = response.data.data.items.filter(trnsx => Date.parse(trnsx.block_signed_at) > lastweek)
            const filteredevent = filteredtime.filter(trnsx => trnsx.decoded!=null).reverse()

            // https://api.covalenthq.com/v1/apps/@covalent-3/balancer_insights/swap/

            setSwaps(filteredevent.filter(trnsx => trnsx.decoded.name === 'LOG_SWAP'))
            setJoins(filteredevent.filter(trnsx => (trnsx.decoded.name === 'LOG_JOIN' || trnsx.decoded.name === 'LOG_EXIT')))
            setOthers(filteredevent.filter(trnsx => (trnsx.decoded.name !== 'LOG_JOIN' && trnsx.decoded.name !== 'LOG_SWAP' && trnsx.decoded.name !== 'LOG_EXIT' )))

            setLoading(false)
            
        }
        setLoading(true)
        getBlockHeight(); 

    }, []);

    // TODO: keep one original array, and on button click, we filter the events based on time or event :3

    return(
        <div> 
            <button onClick={()=>console.log(joins)}> check </button>
            <button onClick={newapi}> project api  </button>
            <h3> <a style={{color: 'black', textDecoration: 'none'}} href={'https://pools.balancer.exchange/#/pool/0x8b6e6e7b5b3801fed2cafd4b22b8a16c2f2db21a/'} target="_blank" rel="noreferrer"> Balancer DAI/WETH Liquidity Pool </a> </h3>
            {loading && <img style={{margin: '50px 75px'}} src={logo2} alt={'loading_animation'} width='250px' height="250px" /> } 
            {!loading && <div style={{display: 'flex', marginTop: '0px'}}>
                <table>
                    <h4> LOG_SWAP </h4>
                    <tr>
                        <th> time </th>
                        <th> caller </th>
                        <th> in-for-out </th>
                        <th> hash </th>
                    </tr>
                    {swaps.map((item, index) =>(
                        <tr>
                            <td> {item.block_signed_at} </td>
                            <td> {item.decoded.params[0].value.substr(0, 8) + "..."} </td>
                            <td> { (Number(item.decoded.params[3].value)/(Math.pow(10, 18))).toFixed(3) + " " + (item.decoded.params[1].value === '0x6b175474e89094c44da98b954eedeac495271d0f' ? 'DAI' : 'WETH') + " : " + (Number(item.decoded.params[4].value)/(Math.pow(10, 18))).toFixed(3) + " " + (item.decoded.params[2].value === '0x6b175474e89094c44da98b954eedeac495271d0f' ? 'DAI' : 'WETH') } </td>
                            <td> <a style={{color: '#C38D9E'}} href={"https://etherscan.io/tx/"+item.tx_hash} target="_blank" rel="noreferrer"> {item.tx_hash.substr(0, 15) + "..."} </a> </td>
                        </tr>
                    ))}

                </table>
                <table>
                    <h4> LOG_JOINS/EXITS </h4>
                    <tr>
                        <th> time </th>
                        <th> time </th>
                        <th> time </th>
                        <th> time </th>
                        <th> time </th>
                    </tr>
                </table>
            </div>}
        </div>
    )
}