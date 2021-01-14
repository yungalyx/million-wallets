import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

const Td = styled.td`
    color: ${props => props.credit ? '#41B3A3' : '#E27D60'}
`
const Tr = styled.tr`
    :hover {
        transition: transform 0.1s ease-in;
        transform: scale(1.02);
        cursor: pointer;
    }
}
`


export default function Transaction(props){

    const [credit, setCredit] = useState(true)

    useEffect(() => {
        if(props.item.to_address === props.currAddress.toLowerCase()) {
            setCredit(true)
        } else {
            setCredit(false)
        }
        // console.log(process.env.REACT_APP_COVALENT_KEY)
    }, [props.item.currAddress]);

 

    return(             
            <Tr onClick={()=>props.handleClick(props.item.log_events)}>  
                <td>{props.item.block_signed_at} </td>
                <td> <a style={{color: '#C38D9E'}} href={"https://etherscan.io/tx/"+props.item.tx_hash} target="_blank" rel="noreferrer"> {props.item.tx_hash.substr(0, 15) + "..."} </a> </td>
                <td> {props.item.from_address.substr(0, 15) + "..."} </td>
                <td> {">"} </td>
                <td>{props.item.to_address.substr(0, 15) + "..."} </td>
                <Td credit={credit}>{props.item.value_quote!=null ? 
                "$" + props.item.value_quote.toFixed(2) + " USD" : 
                "$0.00 USD"}</Td>
                <td> {props.item.successful ? "✅" : "❌"} </td>
                <td> {"$" + props.item.gas_quote?.toFixed(2) + " USD" } </td>
            </Tr>
           
    )
}