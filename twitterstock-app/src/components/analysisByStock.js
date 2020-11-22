import React from 'react'
//import { createBrowserHistory } from 'history';
//const history = createBrowserHistory();


export default function AnalisysByStock() {
    return (
        <div style={{display: "block",height:"90vh",background: "blue", padding: "0% 2% 0% 2%" }}>
            <h1 style={{ margin: "0% 0% 3% 0%", paddingTop:"2%" }}>AnalysisByStock</h1>
            <div style={{ display: "flex", justifyContent:"space-between",width:"100%",height:"75%"}}>
                <div style={{width:"49%",height:"100%",background:"white",borderRadius:"5px",display:"flex"
            ,flexDirection:"column",justifyContent:"center",textAlign:"center"}}></div>
                <div style={{width:"49%",height:"100%",background:"white",borderRadius:"5px",display:"flex"
            ,flexDirection:"column",justifyContent:"center",textAlign:"center"}}></div>
            </div>
        </div>
    )
}