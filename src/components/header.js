import React, {useState} from 'react'
import styled, {keyframes} from 'styled-components'
import Balance from './balance'
import Transaction from './transaction'
import Explore from './explore'
import logo2 from '../assets/loading.gif'
import blank from '../assets/BLANK_ICON.png'
import axios from 'axios'
import Transfer from './transfer'


const Search = styled.input`
    color: white;
    background: #C38D9E;
    margin-left: 10px;
`

const Tabs = styled.h3`
    margin-right: 30px;
    font-family: 'Roboto Mono', monospace;
    margin-top: 0px;
    :hover {
        text-decoration: underline;
        cursor: pointer;
    }

`

const Tr = styled.tr`
    td {
        :hover {
            text-decoration: underline;
            cursor: pointer;
        }
    }
`
const FadeInAnimation = keyframes`  
    from { opacity: 0; }
    to { opacity: 1; }
`; 

const Table = styled.table`
    transition: transform 2s ease-in;
    td {
        padding: 10px;
        
    }
    animation: 1s ${FadeInAnimation} ease-in;
`
const Modal = styled.div`
    background-color: white;
    width: 40%; /* Width in proportion to its parent container*/
    max-width: 440px; /* Max width where it stops expanding */
    
    margin: auto; /* Auto margin according to the element width */
    padding: 15px;
    color: black;
    border: 1px solid black;
    border-radius: 20px; /* Optional. Rounds container corners */
`

const Background = styled.div`
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Overlay effect: translucent background: black w/ partial opacity */
    z-index: 1; /* Overlay effect: positioned over other containers */
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    position: fixed; /* Fix position on the top-left corner*/
    top: 0;
    left: 0;
    overflow: auto; /* Enable scroll if needed */
    padding-top: 80px; /* Location of the content container */
`

export default function Header(){

    const [address, setAddress] = useState('')
    const [contract_address, setContract_address] = useState(process.env.REACT_APP_BALANCER_CONTRACT)

    const [cryptos, setCryptos] = useState([])
    const [transactions, setTransactions] = useState([])
    const [protocol, setProtocol] = useState([])
    
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [tab, setTab] = useState("BALANCE")

    const [show, setShow] = useState(false) // this is for modal rendering of transaction logs
    const [logEvents, setLogEvents] = useState([])
    

    const switchTabs = tab => {
        switch(tab) {
            case 'BALANCE':
                setTab('BALANCE')
                break
            case 'TRANSACTIONS':
                setTab('TRANSACTIONS')
                break
            case 'TRANSFERS':
                setTab('TRANSFERS')
                break
            case 'EXPLORE':
                setTab('EXPLORE')
                break
            default:
                setTab('BALANCE')

        }
    }

    const requestAPI = async() => {
        setLoading(true)
        setError(false)
        let balanceurl= `https://api.covalenthq.com/v1/1/address/${address}/balances_v2/?nft=false&key=${process.env.REACT_APP_COVALENT_KEY}`
        let transactionurl = `https://api.covalenthq.com/v1/1/address/${address}/transactions_v2/?key=${process.env.REACT_APP_COVALENT_KEY}`
        let transferurl = `https://api.covalenthq.com/v1/1/address/${address}/transfers_v2/?contract-address=${contract_address}&key=${process.env.REACT_APP_COVALENT_KEY}`


        const balanceRequest = axios.get(balanceurl)
        const transactionRequest = axios.get(transactionurl)
        const transferRequest = axios.get(transferurl)

        axios.all([balanceRequest, transactionRequest, transferRequest]).then(response =>{
            setCryptos(response[0].data.data.items)
            
            //const lastweek = new Date(Date.now() - 604800000)
            // const transactionFiltered = response[1].data.data.items.filter(trnsx => Date.parse(trnsx.block_signed_at) > lastweek)
            setTransactions(response[1].data.data.items)
            setProtocol(response[2].data.data.items)
            console.log(response[1].data.data.items)
            
            setError(false)
            setLoading(false)
            setTab(tab) // rerender tables
        }).catch(errors => {
            console.log(errors)
                setError(true)
                setLoading(false)
                setTab('ERROR')
        })
       
    }

    const handleProtocol = newProtocol => {
        // set contract address
        setContract_address(newProtocol)
        setLoading(true)

        // call api again 
        let transferurl = `https://api.covalenthq.com/v1/1/address/${address}/transfers_v2/?contract-address=${newProtocol}&key=${process.env.REACT_APP_COVALENT_KEY}`
        axios.get(transferurl).then(response => {
            // set transactions
            setProtocol(response.data.data.items)
            setTab('TRANSFERS')
            setLoading(false)
        }).catch(errors => {
            console.log(errors)
                setError(true)
                setLoading(false)
                setTab('ERROR')
        })
    }

    const showLogEvent = data => {
        setShow(true)
        console.log(data)
        setLogEvents(data)
    }


    return(
        <div style={{margin: '40px'}}> 
            <h2 style={{ fontFamily: "'Roboto Mono', monospace" }}> Dashboard </h2>

            <div style={{display: 'flex'}}> 
                <Tabs onClick={()=>switchTabs('BALANCE')}> Balance </Tabs>
                <Tabs onClick={()=>switchTabs('TRANSACTIONS')}> Transactions </Tabs>
                <Tabs onClick={()=>switchTabs('TRANSFERS')}> Transfers </Tabs>
                <Tabs onClick={()=>switchTabs('EXPLORE')}> Explore </Tabs>
            </div>

            Search by address: <Search type='text' value={address} onChange={(e)=>{setAddress(e.target.value)}}/>
            <button onClick={requestAPI}> Submit </button>
            <br/>

            {loading && <img style={{margin: '50px 75px'}} src={logo2} alt={'loading_animation'} width='250px' height="250px" /> } 
            {error && <p style={{color: 'red'}}> Invalid address </p>}
            
            <br/> 
            {tab === "BALANCE" && !error && !loading && 
            <div>
                <h4 style={{marginTop:'0px'}}> {"Total Balance: $" + cryptos.reduce((a, b) => a + b["quote"], 0).toFixed(2) + " USD"} </h4>
                <Table> 
                    <tr>
                        <th> </th>
                        <th> Name </th>
                        <th> Holdings </th>
                        <th> Quantity </th>
                        <th> Spot Price </th>
                    </tr>
                    {cryptos.map((item, index) => (
                        <Balance key={index} item={item} />
                    ))}
                </Table>
            </div>
                } 
               
            {tab === "TRANSACTIONS" && !error && !loading && 
            <div>
                <h4 style={{marginTop:'0px'}}> {"Accumulated transaction costs: $" + transactions.reduce((a, b) => a + b["gas_quote"], 0).toFixed(2) + " USD"} </h4>
                {show && 
                <Background onClick={()=>setShow(false)}>
                    <Modal>
                        <table>
                            <tr>
                                <th> index </th>
                                <th> event </th>

                            </tr>
                            {logEvents.map((item, index) => (
                            <tr>
                                <td> {index} </td>
                                <td> {item.decoded != null ? item.decoded.name : "topic hash not yet decoded"}</td>
                            </tr>
                            ))}
                        </table>
                    </Modal>
                </Background>}

                <Table>
                    <tr>
                        <th> Time </th>
                        <th> tx_hash </th>
                        <th> From </th>
                        <th> </th>
                        <th> To </th>
                        <th> Value </th>
                        <th> Successful?</th>
                        <th> Gas fee </th>
                    </tr>
                    {transactions.map((item, index) => (
                            <Transaction key={index} item={item} currAddress={address} handleClick={showLogEvent}/>
                        ))} 
                </Table>
            </div>
            }

            {tab === "TRANSFERS" && !error && !loading && 
                <div>
                <table>
                    <Tr>
                        <td onClick={()=>handleProtocol('0xba100000625a3754423978a60c9317c58a424e3d')}> BAL </td>
                        <td onClick={()=>handleProtocol('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')}> WETH </td>
                        <td onClick={()=>handleProtocol('0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f')}> SNX </td>
                        <td onClick={()=>handleProtocol('0xdac17f958d2ee523a2206206994597c13d831ec7')}> USDT </td>
                        <td onClick={()=>handleProtocol('0x2260fac5e5542a773aa44fbcfedf7c193bc2c599')}> WBTC </td> 
                        <td onClick={()=>handleProtocol('0x6b175474e89094c44da98b954eedeac495271d0f')}> DAI </td>
                        <td onClick={()=>handleProtocol('0xB8c77482e45F1F44dE1745F52C74426C631bDD52')}> BNB </td>
                        <td> <img src={protocol.length === 0 ? blank : protocol[0].transfers[0].logo_url} alt="." width="25px" height="25px"/> </td>
                    </Tr>
                </table>

               
                <Table>
                    <tr>
                        <th> Time </th>
                        <th> From </th>
                        <th> tx_hash </th>
                        <th> To </th>
                        <th> Transfer value </th>
                        <th> Transfer cost </th>
                    </tr>
                    {protocol.map((item, index) => (
                            <Transfer key={index} item={item} currAddress={address}/>
                        ))} 
                </Table>
            </div>
            }

            {tab === "EXPLORE" && !error && !loading && 
                <Explore>
                    /v1/1/events/address/{address}/
                </Explore>
            }
                
    
        </div>
    )
}