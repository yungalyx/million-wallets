import React, {useState, useEffect} from 'react'


export default function Transaction(props){

    return(
        <tr>  
            <td>{props.item.block_signed_at} </td>
            <td>{props.item.from_address} </td>
            <td> {"-->"} </td>
            <td>{props.item.to_address} </td>
            <td>{props.item.value}</td>
         
        </tr>
    )
}