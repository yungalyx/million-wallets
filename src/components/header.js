import React, {useState} from 'react'
import styled, {keyframes} from 'styled-components'
import Balance from './balance'
import Transaction from './transaction'
import logo from '../assets/loadin_gif.gif'
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

export default function Header(){

    const [address, setAddress] = useState('')
    const [contract_address, setContract_address] = useState(process.env.REACT_APP_BALANCER_CONTRACT)

    const [cryptos, setCryptos] = useState([])
    const [transactions, setTransactions] = useState([])
    const [protocol, setProtocol] = useState([])
    
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [tab, setTab] = useState("BALANCE")
    

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
            default:
                setTab('BALANCE')

        }
    }

    const requestAPI = async() => {
        setLoading(true)
        setError(false)
        let balanceurl= `https://api.covalenthq.com/v1/1/address/${address}/balances_v2/?nft=false&key=${process.env.REACT_APP_COVALENT_KEY}`
        let transactionurl = `https://api.covalenthq.com/v1/1/address/${address}/transactions_v2/?no-logs=true&key=${process.env.REACT_APP_COVALENT_KEY}`
        let transferurl = `https://api.covalenthq.com/v1/1/address/${address}/transfers_v2/?contract-address=${contract_address}&key=${process.env.REACT_APP_COVALENT_KEY}`


        const balanceRequest = axios.get(balanceurl)
        const transactionRequest = axios.get(transactionurl)
        const transferRequest = axios.get(transferurl)

        axios.all([balanceRequest, transactionRequest, transferRequest]).then(response =>{
            setCryptos(response[0].data.data.items)
            setTransactions(response[1].data.data.items)
            setProtocol(response[2].data.data.items)
            

            setError(false)
            setLoading(false)
            setTab(tab) // rerender tables
            console.log(response[2].data.data.items)
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
    

    return(
        <div style={{margin: '40px'}}> 
            <h2 style={{ fontFamily: "'Roboto Mono', monospace" }}> Dashboard </h2>

            <div style={{display: 'flex'}}> 
                <Tabs onClick={()=>switchTabs('BALANCE')}> Balance </Tabs>
                <Tabs onClick={()=>switchTabs('TRANSACTIONS')}> Transactions </Tabs>
                <Tabs onClick={()=>switchTabs('TRANSFERS')}> Transfers </Tabs>
            </div>

            Search by address: <Search type='text' value={address} onChange={(e)=>{setAddress(e.target.value)}}/>
            <button onClick={requestAPI}> Submit </button>
            <br/>

            {loading && <img style={{marginRight: '25px'}} src={logo} alt={'loading_animation'} width='175px' height="125px" /> } 
            {error && <p style={{color: 'red'}}> Invalid address </p>}
            
            <br/> 
            {tab === "BALANCE" && !error && !loading && 
            <div>
                <h4 style={{marginTop:'0px'}}> {"Total Balance: $" + cryptos.reduce((a, b) => a + b["quote_rate"], 0).toFixed(2) + " USD"} </h4>
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
            <Table>
                <tr>
                    <th> Time </th>
                    <th> From </th>
                    <th> </th>
                    <th> To </th>
                    <th> Value </th>
                </tr>
                 {transactions.map((item, index) => (
                        <Transaction key={index} item={item} currAddress={address}/>
                    ))} 
            </Table>
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
                        <th> Value </th>
                    </tr>
                    {protocol.map((item, index) => (
                            <Transfer key={index} item={item} currAddress={address}/>
                        ))} 
                </Table>
            </div>
            }
                
    
        </div>
    )
}