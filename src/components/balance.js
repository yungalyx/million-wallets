import React, {useState, useEffect} from 'react'

export default function Balance(props){

    const [divBy0, setdivby0] = useState(false)

    useEffect(() => {
        if(props?.item?.quote_rate === 0) {
            setdivby0(true)
        }
        // console.log(process.env.REACT_APP_COVALENT_KEY)
    }, [props.item.quote_rate]);


    return(
        <tr>
            <td>  <img src={props.item.logo_url} alt='.' width="20" height="20" /> </td>
            <td>{props.item.contract_name} </td>
            <td style={{marginRight: '15px'}}> {"$"+ props.item.quote.toFixed(2) + ' USD'}</td>
            <td>  
                {!divBy0 && (props.item.quote / props.item.quote_rate).toFixed(4)+ " " + props.item.contract_ticker_symbol}
                {divBy0 && ("0 " + props.item.contract_ticker_symbol)}     
            </td>
            <td> {"$"+props.item.quote_rate.toFixed(2)+" USD"}  </td>
        </tr>              
    )
}