import React from 'react'
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

export default function Navbar(){
    return(
        <div style={{height:"10vh",display:"flex",background:"black",color:"white",fontWeight:"600"}}>
            <p style={{padding:"0% 4% 0% 2%", cursor:"pointer"}} onClick={()=>{history.push('/');history.go('/')}}>logo</p>
            <p style={{padding:"0% 4% 0% 4%", cursor:"pointer"}} onClick={()=>{history.push('/dashboard');history.go('/dashboard')}}>dashboard</p>
            <p style={{padding:"0% 4% 0% 4%", cursor:"pointer"}} onClick={()=>{history.push('/byStockAnalysis');history.go('/byStockAnalysis')}}>analisys by stock</p>
            <p style={{padding:"0% 4% 0% 4%", cursor:"pointer"}} onClick={()=>{history.push('/customAnalysis');history.go('/customAnalysis')}}>custom analisys</p>
        </div>
    )
}