import React from 'react'
import styled from 'styled-components'

const Tdn = styled.td`
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
export default function Transfer(props){

    return(
        <tr>  
            <Tdn>{props.item.block_signed_at} </Tdn>
            <Tdn>{props.item.transfers[0]?.from_address} </Tdn>
            <Tdn> <a href={"https://etherscan.io/tx/"+props.item.transfers[0]?.tx_hash} target="_blank" rel="noreferrer">{props.item.transfers[0]?.tx_hash} </a> </Tdn>
            <Tdn>{props.item.transfers[0]?.contract_name} </Tdn>
            <td>{props.item.transfers[0].delta_quote != null ? 
            "$" + props.item.transfers[0]?.delta_quote.toFixed(2) + " USD" : 
            "❓ USD"}</td>
            <td> {"$"+ (props.item.gas_quote != null ? props.item.gas_quote.toFixed(2) : "0.00") + " USD"}  </td>
        </tr>
    )
}