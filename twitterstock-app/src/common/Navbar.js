import React, { useState } from 'react'
import { createBrowserHistory } from 'history';
import Logo from '../assets/logo.svg'

const history = createBrowserHistory();

export default function Navbar() {
    const [tab, setTab] = useState("dash");
    return (
        <div style={{height: "100%", width: "8%", boxSizing: "border-box", padding: "4% 1% 2% 1%", display: "flex", flexDirection: "column", background: "white", color: "black", fontWeight: "600",borderRadius:"25px 0px 0px 25px",textAlign:"center"}}>
            <div style={{ height: "30%" }}>
                <img style={{ padding: "0% 4% 0% 2%", cursor: "pointer", wordBreak: "break-word" }} onClick={() => { history.push('/'); history.go('/') }} src={Logo}></img>
            </div>
            <div style={{ display: "flex",width:"100%" ,flexDirection: "column", textAlign: "center", justifyContent: "center" }}>
                <img onClick={() => { history.push('/dashboard'); history.go('/dashboard') }} style={{ width: "30px", height: "30px", padding: "0% 30% 20% 30%", cursor: "pointer" }} src="https://img.icons8.com/material/48/000000/dashboard-layout.png" />
                <img onClick={() => { history.push('/byStockAnalysis'); history.go('/byStockAnalysis') }} style={{ width: "30px", height: "30px", padding: "20% 30% 20% 30%", cursor: "pointer" }} src="https://img.icons8.com/fluent-systems-filled/24/000000/bar-chart.png" />
                <img onClick={() => { history.push('/customAnalysis'); history.go('/customAnalysis') }} style={{ width: "30px", height: "30px", padding: "20% 30% 20% 30%", cursor: "pointer" }} src="https://img.icons8.com/android/24/000000/twitter.png" />
                <img onClick={() => { history.push('/customAnalysis'); history.go('/customAnalysis') }} style={{ width: "30px", height: "30px", padding: "20% 30% 20% 30%", cursor: "pointer" }} src="https://img.icons8.com/fluent-systems-filled/50/000000/services.png" />
            </div>
        </div>
    )
}