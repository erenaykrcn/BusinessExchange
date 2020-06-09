import React from "react";
import stocks from "../../config/stocks.json";

class CurrencyColumn extends React.Component {
    state = {
        settings: {},
    }

    componentDidMount() {
        let {name} = this.props;
        let thisC =this;

        this.setState({
            stock: stocks[name],
        })

        fetch("/api?format=json").then(response => response.json())
        .then((jsonData) => {
            let settings = jsonData["results"][0];
            console.log(settings);
            thisC.setState({
                settings: settings
            })
        })
        .catch((error) => {
            console.error(error)
        })


    }

    render() {
        


        let {name} = this.props;
        let buysellMargin = parseFloat(this.state.settings["buysellMargin"]);
        let sell;
        let thisC = this;

        if(this.state.rate) {
            sell = parseFloat(this.state.rate) + parseFloat(parseFloat(this.state.rate)*(buysellMargin/100));  //narrows it into 3 decimal places
            sell = sell.toFixed(3);
        }

        function buyHandler(name) {
            document.getElementById("alertBox").style.display = "block";

            setTimeout(() => { 
                document.getElementById("alertBoxInner").style.height = "40vw";
            })


            document.getElementById("heading").innerHTML = "Buy " + name;
            document.getElementById("exchangeRate").innerHTML = thisC.state.rate;
            document.getElementById("button").innerHTML = "BUY";
        }


        function sellHandler(name) {
            document.getElementById("alertBox").style.display = "block";

            setTimeout(() => { 
                document.getElementById("alertBoxInner").style.height = "40vw";
            })


            document.getElementById("heading").innerHTML = "Sell " + name;
            document.getElementById("exchangeRate").innerHTML = (thisC.state.rate + thisC.state.rate*(thisC.state.settings["buysellMargin"]/100)).toFixed(5);
            document.getElementById("button").innerHTML = "SELL";

        }

        function buyHover() {
            document.getElementById("buyNav").style.fontSize = "1.7vw";
            document.getElementById("buyNav").style.color = "#79edc3";

            if(window.innerWidth < 800) {
                document.getElementById("buyNav").style.fontSize = "2.9vw";
            }

        }

        function nbuyHover() {
            document.getElementById("buyNav").style.fontSize = "1.2vw";
            document.getElementById("buyNav").style.color = "#e6fbfc";

            if(window.innerWidth < 800) {
                document.getElementById("buyNav").style.fontSize = "2.5vw";

            }


        }

        function sellHover() {
            document.getElementById("sellNav").style.fontSize = "1.7vw";
            document.getElementById("sellNav").style.color = "#79edc3";
            
            if(window.innerWidth < 800) {
                document.getElementById("sellNav").style.fontSize = "2.9vw";
            }


        }

        function nsellHover() {
            document.getElementById("sellNav").style.fontSize = "1.2vw";
            document.getElementById("sellNav").style.color = "#e6fbfc";

            if(window.innerWidth < 800) {
                document.getElementById("sellNav").style.fontSize = "2.5vw";

            }
        }



        return(
            <div className="currCol">
                <div className="currNav2">{name}</div>
                <div className="currNav2" onClick={() => {buyHandler(name)}} onMouseOver={buyHover} onMouseOut={nbuyHover}>{this.state.rate}</div>
                <div className="currNav2" onClick={() => {sellHandler(name)}} onMouseOver={sellHover} onMouseOut={nsellHover} >{sell}</div>
                <div className="currNav21">{this.state.stock}</div>
            </div>  
        )
    }
}

export default CurrencyColumn