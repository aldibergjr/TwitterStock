import React, {useState} from 'react'
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

export default function Navbar() {
    const [tab,setTab] = useState("dash");
    return (
        <div style={{position: "sticky", top: "0", height: "100vh", width: "7%", boxSizing: "border-box", padding: "2% 1% 2% 1%", display: "flex", flexDirection: "column", background: "white", color: "black", fontWeight: "600" }}>
            <p style={{ height:"20%" ,padding: "0% 4% 0% 2%", cursor: "pointer", wordBreak: "break-word" }} onClick={() => { history.push('/'); history.go('/') }}>logo</p>
            <div style={{display:"flex",flexDirection:"column",textAlign:"center",justifyContent:"center"}}>
                <img onClick={() => { history.push('/dashboard'); history.go('/dashboard') }} style={{width:"30px",height:"30px",padding:"20%",cursor:"pointer"}} src="https://img.icons8.com/material/48/000000/dashboard-layout.png"/>
                <img onClick={() => { history.push('/byStockAnalysis'); history.go('/byStockAnalysis') }} style={{width:"30px",height:"30px",padding:"20%",cursor:"pointer"}} src="https://img.icons8.com/fluent-systems-filled/24/000000/bar-chart.png"/>
                <img onClick={() => { history.push('/byStockAnalysis'); history.go('/customAnalysis') }} style={{width:"30px",height:"30px",padding:"20%",cursor:"pointer"}} src="https://img.icons8.com/android/24/000000/twitter.png"/>
                <img onClick={() => { history.push('/byStockAnalysis'); history.go('/customAnalysis') }} style={{width:"30px",height:"30px",padding:"20%",cursor:"pointer"}} src="https://img.icons8.com/fluent-systems-filled/50/000000/services.png"/>
            </div>
        </div>
    )
}