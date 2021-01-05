import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import Balance from './balance'


const Search = styled.input`
    color: white;
    background: purple;
    margin-left: 10px;
`

export default function Header(){

    const [address, setAddress] = useState('')
    const [error, setError] = useState(false)
    const [cryptos, setCryptos] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(false)
        // console.log(process.env.REACT_APP_COVALENT_KEY)
    }, []);


    const submitAPI = async() => {
        const url = `https://api.covalenthq.com/v1/1/address/${address}/balances_v2/?nft=false&key=${process.env.REACT_APP_COVALENT_KEY}`
        setLoading(true)
        setError(false)
        await fetch(url)
            .then(res => {
                if(res.ok) {
                    return res.json()
                }})
            .then(res => {
                console.log(res.data)
                setCryptos(res.data.items)
                setError(false)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setError(true)
                setLoading(false)
            })           
    }
    

    return(
        <div style={{margin: '40px'}}> 
        <h2> Dashboard </h2>
        Search by address: <Search type='text' value={address} onChange={(e)=>{setAddress(e.target.value)}}/>
        <button onClick={submitAPI}> Submit </button>
        <div>
            {loading && <p> Loading... </p>} 
            {error && <p style={{color: 'red'}}> Invalid address </p>}
            {!error && !loading && <div> {cryptos.map((item, index) => (
                    <Balance key={index} item={item} />
                ))} </div>}
            
    
        </div>
     
         
        </div>
    )
}