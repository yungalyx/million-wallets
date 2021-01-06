import React from 'react'
import styled from 'styled-components'

const Td = styled.td`
    color: ${props => props.credit ? '#41B3A3' : '#E27D60'}
`


export default function Transaction(props){

    const credit = (props.item.to_address === props.currAddress)

    return(
        <tr>  
            <td>{props.item.block_signed_at} </td>
            <td>{props.item.from_address} </td>
            <td> {">"} </td>
            <td>{props.item.to_address} </td>
            <Td credit={credit}>{"$" + props.item.value_quote.toFixed(2) + "USD"}</Td>
        </tr>
    )
}