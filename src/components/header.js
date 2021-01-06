import React, {useState, useEffect} from 'react'
import styled, {keyframes} from 'styled-components'
import Balance from './balance'
import Transaction from './transaction'
import logo from '../assets/loadin_gif.gif'
import axios from 'axios'


const Search = styled.input`
    color: white;
    background: #C38D9E;
    margin-left: 10px;
`

const Tabs = styled.h3`
    margin-right: 30px;
    margin-top: 0px;
    :hover {
        text-decoration: underline;
        cursor: pointer;
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
    const [error, setError] = useState(false)
    const [cryptos, setCryptos] = useState([])
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(false)
    const [tab, setTab] = useState("BALANCE")

    useEffect(() => {
        setLoading(false)
        // console.log(process.env.REACT_APP_COVALENT_KEY)
    }, []);

    const switchTabs = tab => {
        switch(tab) {
            case 'BALANCE':
                setTab('BALANCE')
                break
            case 'TRANSACTIONS':
                setTab('TRANSACTIONS')
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

        const balanceRequest = axios.get(balanceurl)
        const transactionRequest = axios.get(transactionurl)

        axios.all([balanceRequest, transactionRequest]).then(response =>{
            setCryptos(response[0].data.data.items)
            setTransactions(response[1].data.data.items)
            //console.log("balance", response[0])
            //console.log("transaction", response[1])
            setError(false)
            setLoading(false)
            if(tab === 'BALANCE') {
                setTab('BALANCE')
            }
        }).catch(errors => {
            console.log(errors)
                setError(true)
                setLoading(false)
                setTab('ERROR')
        })
       
    }
    

    return(
        <div style={{margin: '40px'}}> 
            <h2> Dashboard </h2>

            <div style={{display: 'flex'}}> 
                <Tabs onClick={()=>switchTabs('BALANCE')}> Balance </Tabs>
                <Tabs onClick={()=>switchTabs('TRANSACTIONS')}> Transactions </Tabs>
            </div>

            Search by address: <Search type='text' value={address} onChange={(e)=>{setAddress(e.target.value)}}/>
            <button onClick={requestAPI}> Submit </button>
            <br/>

            {loading && <img style={{marginRight: '25px'}} src={logo} alt={'loading_animation'} width='175px' height="125px" /> } 
            {error && <p style={{color: 'red'}}> Invalid address </p>}
            
            <br/> 
            {tab === "BALANCE" && !error && !loading && 
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
                
    
        </div>
    )
}