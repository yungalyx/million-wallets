import React, {useState, useEffect} from 'react'
import styled from 'styled-components';


const Table = styled.table`
    td {
        padding: 10px;
    }
`


export default function Balance(props){

    const [divBy0, setdivby0] = useState(false)

    useEffect(() => {
        if(props.item.quote_rate == 0) {
            setdivby0(true)
        }
        // console.log(process.env.REACT_APP_COVALENT_KEY)
    }, []);


    return(
        <>  
          
            <div style={{display: 'flex', margin: '10px',}}>
                <Table>
                    <tr>
                        <td>  <img src={props.item.logo_url} alt='logo' width="20" height="20" /> </td>
                        <td>{props.item.contract_name} </td>
                        <td> {"$"+ props.item.quote.toFixed(2) + ' USD'}</td>
                        <td>  
                            {!divBy0 && "Quantity: " + (props.item.quote / props.item.quote_rate).toFixed(4)+ " " + props.item.contract_ticker_symbol}
                            {divBy0 && "Quantity: 0"}     
                        </td>
                        <td> {"Market Value: " + props.item.quote_rate.toFixed(2)}  </td>
                    </tr>
                </Table>
                
            </div>
        </>
    )
}