import React from 'react';
import './index.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from './common/Navbar';
import Dashboard from './components/dashboard'
import AnalysisByStock from './components/analysisByStock'
import CustomAnalysis from './components/customAnalysis'


export default function Routes() {
    return (
        <div style={{display:"flex", height:"100vh",width:"100vw"}}>
            <Navbar />
            <BrowserRouter>
                <Switch>
                    <Route path="/customAnalysis"><CustomAnalysis /></Route>
                    <Route path="/byStockAnalysis"><AnalysisByStock /></Route>
                    <Route path="/dashboard"><Dashboard /></Route>
                    <Route path="/"><Dashboard /></Route>
                </Switch>
            </BrowserRouter>
        </div>
    );
}
