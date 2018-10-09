import React from 'react';
import axios from 'axios';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';

var server_ip="192.168.1.14";
var server_port="5002";

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      currentData: null,
    }
    this.fetchPriceData=this.fetchPriceData.bind(this);
    this.fetchPriceData('AAPL');
  }
  
  fetchPriceData(ticker){
    axios.get('http://'+server_ip+':'+server_port+'/stock/'+ticker)
      .then((response)=>{
        console.log(response);
        var data=[];
        for (let i=0; i<response.data.data.datetime.length; i+=1){
          //console.log(response.data.data.datetime[i]);
          //let timestamp=new Date(parseInt(response.data.data.datetime[i])*1000).toDateString();
          data.push({x:parseInt(response.data.data.datetime[i])*1000,y:parseFloat(response.data.data.price[i])});
        }
        this.setState({currentData:data});
        console.log(this.state.currentData)
      });
  }

  reloadData(){
    this.fetchPriceData(document.getElementById("ticker_input").value);
  }

  render() {
    var chartOptions = {
      segmentShowStroke : true
    };
    return ( 
      <div>
        <span style={{display:'block'}}>Stock Spider Viewer</span>
        <input type="text" id="ticker_input" />
        <button onClick={(e) =>{this.reloadData()}}>Reload Data</button>
        <XYPlot
          width={900}
          height={500}>
          <HorizontalGridLines />
          <LineSeries
            color="red"
            data={this.state.currentData}/>
          <XAxis title="X" />
          <YAxis />
        </XYPlot>
      </div>
    );
  }
}

export default App;