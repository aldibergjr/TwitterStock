import React from 'react'
//import { createBrowserHistory } from 'history';
//const history = createBrowserHistory();

export default function Dashboard(){
    return(
        <div style={{display:"block" ,background:"white",padding:"0% 10% 0% 10%",overflowY:"auto"}}>
            <h1>Dashboard</h1>
            <div style={{display:"flex"}}>
                <div style={{width:"70%", padding:"0% 5% 0% 0%"}}>
                    <h2>principais stocks recomendadas</h2>
                    <div style={{width:"100%",height:"400px",background:"gray",borderRadius:"5px"}}></div>
                    <div style={{width:"100%",height:"400px",background:"gray",borderRadius:"5px",margin:"5% 0% 5% 0%"}}></div>
                    <h3>principais tweets</h3>
                    <h4>$LOL</h4>
                    <div style={{width:"100%",height:"100px",background:"gray",borderRadius:"5px",margin:"2% 0% 0% 0%"}}></div>
                    <div style={{width:"100%",height:"100px",background:"gray",borderRadius:"5px",margin:"2% 0% 0% 0%"}}></div>
                    <div style={{width:"100%",height:"100px",background:"gray",borderRadius:"5px",margin:"2% 0% 0% 0%"}}></div>
                    <h4>$WOW</h4>
                    <div style={{width:"100%",height:"100px",background:"gray",borderRadius:"5px",margin:"2% 0% 0% 0%"}}></div>
                    <div style={{width:"100%",height:"100px",background:"gray",borderRadius:"5px",margin:"2% 0% 0% 0%"}}></div>
                    <div style={{width:"100%",height:"100px",background:"gray",borderRadius:"5px",margin:"2% 0% 5% 0%"}}></div>
                </div>
                <div style={{width:"30%"}}>
                    <h2>análises de sentimento</h2>
                    <div style={{width:"100%",height:"200px",background:"gray",borderRadius:"10px",margin:"5% 0% 5% 0%"}}></div>
                    <div style={{width:"100%",height:"200px",background:"gray",borderRadius:"10px",margin:"5% 0% 5% 0%"}}></div>
                    <div style={{width:"100%",height:"200px",background:"gray",borderRadius:"10px",margin:"5% 0% 5% 0%"}}></div>
                </div>
            </div>
        </div>
    )
}