import React, {useState} from 'react'
//import { createBrowserHistory } from 'history';
//const history = createBrowserHistory();
import { Line } from 'react-chartjs-2';

export default function Dashboard() {
    const [data] = useState({
        labels: ['a', 'b', 'c', 'd', 'e', 'f', 'g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
        datasets: [
            {
                label: 'My First dataset',
                tension:0,
                borderWidth: 2,
                data: ['5', '7', '12', '33', '10', '18', '20','14','5','6','7','2','15','16','16','17','16','14','13','14','11','12','15','18','16','15']
            }
        ]
    })
    const options = {
        scales: {
            xAxes: [{
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                }
            }],
            yAxes: [{
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                }   
            }]
        },
        elements:{
            point:{
                radius: 0
            }
        }
    }

    function setGradientColor(canvas, color){
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0,0,0,450)
        gradient.addColorStop(0,color);
        gradient.addColorStop(0.3,"rgba(255,0,0,0.4");
        gradient.addColorStop(0.7,"rgba(255,0,0,0)");
        return gradient;
    }

    const getChartData = canvas => {
        if(data.datasets){
            let colors = ["rgba(255,0,0,0.8)"]
            data.datasets.forEach((set,i)=>{
                set.backgroundColor = setGradientColor(canvas,colors[i])
                set.borderColor = "red"
                set.borderWidth = 3
            })
        }
        return data
    }

    return (
        <div style={{ display: "block", background: "white", padding: "0% 10% 0% 10%", overflowY: "auto" }}>
            <h1>Dashboard</h1>
            <div style={{ display: "flex" }}>
                <div style={{ width: "70%", padding: "0% 5% 0% 0%" }}>
                    <h2>principais stocks recomendadas</h2>
                    <div style={{ width: "100%", height: "400px", background: "white", borderRadius: "5px" }}>
                        <Line data={getChartData} options={options} width={100} height={50} />
                    </div>
                    <div style={{ width: "100%", height: "400px", background: "gray", borderRadius: "5px", margin: "5% 0% 5% 0%" }}></div>
                    <h3>principais tweets</h3>
                    <h4>$LOL</h4>
                    <div style={{ width: "100%", height: "100px", background: "gray", borderRadius: "5px", margin: "2% 0% 0% 0%" }}></div>
                    <div style={{ width: "100%", height: "100px", background: "gray", borderRadius: "5px", margin: "2% 0% 0% 0%" }}></div>
                    <div style={{ width: "100%", height: "100px", background: "gray", borderRadius: "5px", margin: "2% 0% 0% 0%" }}></div>
                    <h4>$WOW</h4>
                    <div style={{ width: "100%", height: "100px", background: "gray", borderRadius: "5px", margin: "2% 0% 0% 0%" }}></div>
                    <div style={{ width: "100%", height: "100px", background: "gray", borderRadius: "5px", margin: "2% 0% 0% 0%" }}></div>
                    <div style={{ width: "100%", height: "100px", background: "gray", borderRadius: "5px", margin: "2% 0% 5% 0%" }}></div>
                </div>
                <div style={{ width: "30%" }}>
                    <h2>análises de sentimento</h2>
                    <div style={{ width: "100%", height: "200px", background: "gray", borderRadius: "10px", margin: "5% 0% 5% 0%" }}></div>
                    <div style={{ width: "100%", height: "200px", background: "gray", borderRadius: "10px", margin: "5% 0% 5% 0%" }}></div>
                    <div style={{ width: "100%", height: "200px", background: "gray", borderRadius: "10px", margin: "5% 0% 5% 0%" }}></div>
                </div>
            </div>
        </div>
    )
}