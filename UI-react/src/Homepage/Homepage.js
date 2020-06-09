import React from 'react';
import CurrencyColumn from "./components/CurrencyColumn.js";

import airportB from "./assets/airportBack.png";
import airportF from "./assets/airportFront.png";
import plane from "./assets/plane.png";
import usd from "./assets/usd.png";
import coin from "./assets/coin.png";
import logo from "./assets/logo.png";
import sh from "./assets/sh.png";
import map from "./assets/map.jpg";

import curs from  "../config/currencies.json";





class Homepage extends React.Component {
    state = {
        wheeledOnce: false,
        planeWheel: false,
        lastUpdate: "",
        columns: [],
        rates:[],
        refs:[],
        settings: {}
       
    }

    constructor(props){
        super(props);
        
        for (let i=0;i<curs["currencies"].length;i++) {
            let ref = React.createRef();
            this.state.refs.push(ref);

        }
        
    }


    handleWheel() {
        if (!this.state.wheeledOnce) { //handles the Coin zoom
            let inter = window.setInterval( () => {
                document.getElementById("coin").style.width = "15vw";
                document.getElementById("coin").style.marginLeft = "-20vw";
                document.getElementById("coin").style.marginTop = "50vw";
                window.clearInterval(inter);
                this.state.wheeledOnce = true;
            },200)

        }

        if (!this.state.planeWheel) {  //handles the plane animation
            document.getElementById("plane").style.marginLeft = "-40vw";
            this.state.planeWheel = true;
        }


    }

    handleWheelDown() {
        if (this.state.planeWheel) { //handles the plane animation
            document.getElementById("plane").style.marginLeft = "40vw";
            this.state.planeWheel = false;

        }

    }

    


    componentDidMount() {
        let thisC = this;

        fetch("/api?format=json").then(response => response.json()).then((jsonData) => {
            let settings = jsonData["results"][0];

            thisC.setState({
                settings: settings
            })
        }).catch((error) => {
            console.error(error)
        })
    
        setTimeout(() => {  //handles opening animation
            document.getElementById("pad1").style.top = "0";      
            document.getElementById("pad2").style.top = "28.7vw";      
            document.getElementById("plane").style.marginLeft = "40vw";
            
        })

        document.addEventListener("wheel", (e)=> {
            
            if (e.deltaY > 0) {this.handleWheel()}
            else if (e.deltaY < 0) {this.handleWheelDown()}
        }) 

        let y = window.scrollY;

        window.setInterval( () => {
            if (y>100) {
                document.getElementById("coin").style.width = "15vw";
                document.getElementById("coin").style.marginLeft = "-20vw";
                document.getElementById("coin").style.marginTop = "50vw";
            }
        },1000);
        let cols = [];


        for (let i=0;i<curs["currencies"].length;i++) {
            let name = curs["currencies"][i];
            cols.push(<CurrencyColumn name={name} id={i} ref={this.state.refs[i]} />);  //adds columns

        }

        thisC.setState({
            columns:cols,
        })

        thisC.getRates();

        let intt = window.setInterval(()=>{
            
            if (thisC.state.settings["period"] != undefined) {
                thisC.Inter = window.setInterval(()=>{
                    thisC.getRates();

                },parseInt(thisC.state.settings["period"])*1000);  //gets new rates every ... seconds

                window.clearInterval(intt);
            }



        },300)
        
    }

    componentWillUnmount() {
        clearInterval(this.Inter);
      }

    getRates() { //gets the currency rates
        
        let thisC = this;
        let endpoint = "https://api.exchangeratesapi.io/latest?base=USD";   //used API: Foreign Exchange Rates API, gets data from European Central Bank
            
        let lookupOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }         

        let date = new Date();
        let hours = date.getHours() ;
        let mins = date.getMinutes();
        let secs = date.getSeconds();

        if (hours<10) {
            hours = "0" + hours;
        } 
        if (mins <10) {
            mins = "0" + mins;
        }
        if (secs < 10) {
            secs = "0" + secs;
        }


        let dd =  date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + "  ," + hours + ":" + mins + ":" + secs; 

        fetch(endpoint, lookupOptions).then(res => res.json()).then(function(responseData){
            console.log(responseData["rates"]);
            thisC.setState({
                lastUpdate: dd,
            });

            for (let i=0;i<curs["currencies"].length;i++) {

                let rate =  responseData["rates"][curs["currencies"][i]];

                rate = rate*(10**10); //narrows it into 3 decimal places
                let ed = rate % (10**7);
                rate -= ed;
                rate /= 10**10;
                rate = parseFloat(rate,10);

                thisC.state.refs[i].current.setState({
                
                    rate: rate,   //updates the states of the columns
            
                }) 
                

            }
            



        }).catch(function(error){
            console.log("error",error);
            thisC.setState({
                lastUpdate:"Error while Updating!",
            })


        })

        

    }



    render() {
        let thisC = this;

        function closeTab(){  //closes the alert box
            document.getElementById("alertBoxInner").style.height = "0";
            let intt = window.setInterval(()=>{
                
                document.getElementById("alertBox").style.display = "none";
                window.clearInterval(intt);
            },1000);
            document.getElementById("inputID").value = "";
            document.getElementById("subtotal").innerHTML = "0";
            document.getElementById("commission").innerHTML = "0";
            document.getElementById("total").innerHTML = "0";


        }

        function inputChanged() {   //Handles automatically and dynmaically the commission value

            let amount = ((parseFloat(document.getElementById("exchangeRate").innerHTML,10)**(-1))*document.getElementById("inputID").value).toFixed(4);
            document.getElementById("subtotal").innerHTML = amount;
            let comm;
            comm = amount * parseFloat(thisC.state.settings["commissionPercentage"]) / 100 + parseFloat(thisC.state.settings["surcharge"]);
            comm = comm.toFixed(3);

            if (comm<thisC.state.settings["minimumCommission"]) {
                comm = parseFloat(thisC.state.settings["minimumCommission"]);
            }

            if (document.getElementById("button").innerHTML=="SELL") {

                document.getElementById("commission").innerHTML = " -" + comm;
                let total = parseFloat(amount)-parseFloat(comm);
                let an = total.toFixed(4);
                document.getElementById("total").innerHTML = an + "$";
            } else {
                
                document.getElementById("commission").innerHTML = comm;
                console.log(comm);
                let total = parseFloat(comm)+parseFloat(amount);
                let an = total.toFixed(2);
                document.getElementById("total").innerHTML = an + "$";
            }

        }

        function buyHandler() {
            if (document.getElementById("inputID").value != "") {

                document.getElementById("tick-mark").style.marginLeft = "0";
                document.getElementById("checkmark1").style.display = "block";
    
                let setint = window.setInterval(function() {
                    document.getElementById("tick-mark").style.marginLeft = "-40vw";
                    document.getElementById("checkmark1").style.display = "none";
                    window.clearInterval(setint)
                },4000);
                getRand();

            } else {
                alert("enter a value!");
            }
        }

        function getRand() {  //generates a 6 digit random number
            thisC.setState({
                rand: Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000
            })

        }

        return (
            <div className="mainHome">
                <svg className="checkmark1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" id="checkmark1">
                        <circle className="checkmark__circle1" cx="26" cy="26" r="25" fill="none"/>
                        <path className="checkmark__check1" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>

                <div className="tick-mark" id="tick-mark">
                    Your request has been taken. Please use this reference number to continue your transaction by our office: <br></br><br></br>
                    {this.state.rand}

                </div>

            
                <div className="welcomeBox">
                    <div className="imgCont">

                        <img src={airportB} className="airportB"></img>
                        <img src={airportF} className="airportF"></img>
                        <img src={plane} className="plane" id="plane"></img>

                    </div>
                    <div className="padCont1" id="pad1"></div>
                    <div className="padCont2" id="pad2" ></div>
                    <div className="headerCont" id="header1">
                        <div className="hHeader"><b>Exchange currency easily, overall the Atlanta International Airport</b></div>
                    </div>
                    <div className="subCont" id="header2">
                        
                        <div className="subHeader"><img src={logo} className="logo" ></img>Business Exchange</div>
                        <img src = {usd} className="usdImg"></img>
                        <img src = {coin} className="coin" id="coin"></img>
                    </div>
                </div>


                <div className="usdCont">
                    <div className="navH">
                        <div className="box-1">
                            <div className="btn btn-one" onClick={()=>{
                                let body = document.body;
                                let html = document.documentElement;
                            
                                let height = Math.max( body.scrollHeight, body.offsetHeight, 
                                                    html.clientHeight, html.scrollHeight, html.offsetHeight );

                                console.log(height);
                                window.scrollTo(0,height*0.263);
                            }}>
                                <span><b>HOME</b></span>
                            </div>
                        </div>
                        <div className="box-1">
                            <div className="btn btn-one" onClick={()=>{
                                window.location.href = "/admin";
                            }}>
                                <span><b>ADMIN</b></span>
                            </div>
                        </div>
                    </div>

                    <div className="usdText">
                        Welcome to the Business Exchange!<br></br>
                        <p className="usdT2">We use the USD as our base currency, you can see our exchange rates based in USD:</p>
                    </div>

                    <img src={sh} className="sh-Image"></img>

                    <div   className="exMain" >
                        <div className="exTitle">Buy and Sell Exchange Rates</div>
                        <div className="lastUpdate">Rates last updated at: {this.state.lastUpdate}</div>


                        <div className="currsTable">
                            <div className="currNav">
                                <div className="currNav1">Currency</div>
                                <div className="currNav1" id="buyNav">Buy</div>
                                <div className="currNav1" id="sellNav" >Sell</div>
                                <div className="currNav12">Stock</div>
                            </div>

                            {this.state.columns}
        
                        </div>

                        <div className="alertBox" id="alertBox">
                            <div className="alertBoxInner" id="alertBoxInner">
                                <div className="aBHeadTab">
                                    
                                    <i class="fa fa-times xI" aria-hidden="true" onClick={()=>{closeTab();}} ></i>
                                    <div className="buy" id="heading">Buy EUR</div>
                                </div>

                                <div className="values">

                                    <div className="enter">
                                        <div className="enterLabel">Enter the value: <div className="enterInputDiv"><input type="number" className="enterInput" id="inputID" onChange={()=>{inputChanged();}}></input></div></div>
                                        

                                        <div className="blank1">Exchange Rate: </div><p className="blank" id="exchangeRate"></p><br></br>
                                        <div className="blank1">Subtotal:</div> <p className="blank" id="subtotal">0</p><br></br>
                                        <div className="blank1 comm">Commission: </div><p className="blank" id="commission" >0</p><br></br>
                                        <div className="blank1">Total: </div><p className="blank" id="total" >0</p>
                                    </div>

                                    

                                </div>

                                <button className="buybut" id="button" onClick={buyHandler}>BUY</button>

                            </div>
                        </div>


                    </div>
                    


                </div> 

                <div className="whereAbout"> 
                    <div className="wAHead">Where to find us</div>
                    <img src={map} className="map" ></img>
                    <div className="wAtext"><i className="fa fa-map-marker markerMap" aria-hidden="true"></i>You can find us in the Terminal C, Departures Level 2 of  
                    Atlanta Hartfield-Jackson International Airport<i className="fa fa-map-marker markerMap" aria-hidden="true"></i></div>

                </div> 

                <div className="credits">
                    <div className="contH">Contact Me</div>

                    <div className="tel"><i class="fa fa-phone telI" aria-hidden="true"></i>+49 0176/62694119</div>
                    <div className="tel"><i class="fa fa-envelope mailI" aria-hidden="true"></i>erenay.karacan@tum.de</div>
                    <div className="tel" onClick={()=>{
                        window.open("https://instagram.com/yellowshadow_");
                    }}
                    ><i class="fa fa-instagram instaI" aria-hidden="true"></i>@yellowshadow_</div>

                </div>
                


            </div>
        )
    }
}


export default Homepage;