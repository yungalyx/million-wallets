import React from 'react'
import styled from 'styled-components'

const Td = styled.td`
    color: ${props => props.credit ? '#41B3A3' : '#E27D60'}
`

const Tdn = styled.td`
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
export default function Transfer(props){

    const credit = (props.item.transfers[0]?.from_address === props.currAddress)

    return(
        <tr>  
            <Tdn>{props.item.block_signed_at} </Tdn>
            <Tdn>{props.item.transfers[0]?.from_address} </Tdn>
            <Tdn> <a href={"https://etherscan.io/tx/"+props.item.transfers[0]?.tx_hash} target="_blank" rel="noreferrer">{props.item.transfers[0]?.tx_hash} </a> </Tdn>
            <Tdn>{props.item.transfers[0]?.to_address} </Tdn>
            <Td credit={credit}>{props.item.transfers[0].delta_quote!=null ? 
            "$" + props.item.transfers[0]?.delta_quote.toFixed(2) + " USD" : 
            "$0.00 USD"}</Td>
        </tr>
    )
}