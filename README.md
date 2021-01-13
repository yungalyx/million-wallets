Honorary 'most janky one liner': <br/>

 <code>  <h4 style={{marginTop:'0px'}}> {"Total Balance: $" + cryptos.reduce((a, b) => a + b["quote_rate"], 0).toFixed(2) + " USD"} </h4> </code> 


 <code> <td> { (Number(item.decoded.params[3].value)/(Math.pow(10, 18))).toFixed(3) + " " + (item.decoded.params[1].value == '0x6b175474e89094c44da98b954eedeac495271d0f' ? 'DAI' : 'WETH') + " : " + (Number(item.decoded.params[4].value)/(Math.pow(10, 18))).toFixed(3) + " " + (item.decoded.params[2].value == '0x6b175474e89094c44da98b954eedeac495271d0f' ? 'DAI' : 'WETH') } </td> </code> 
