import React from 'react';
import $ from "jquery";

import nav from "./assets/nav.png";
import as3 from "./assets/as3.png";
import as1 from "./assets/as1.png";




class Admin extends React.Component {
    state = {
        settings: {},
        updateCounter: 0,
        obj: {}
    }

    constructor(props) {
        super(props);
    }
    
    componentWillMount() {
        let thisC = this;

        fetch("/api?format=json").then(response => response.json()).then((jsonData) => {  //retrieves settings config from django REST API
            let settings;
            settings = jsonData["results"][0];
            console.log(settings);

            thisC.setState({
                settings: settings
            })
        }).catch((error) => {
            console.error(error)
        })

    }

    componentDidMount() {  
        let thisC = this;

        fetch("/api?format=json").then(response => response.json()).then((jsonData) => {    //retrieves settings config from django REST API
            let settings;
            settings = jsonData["results"][0];
            console.log(settings);

            thisC.setState({
                settings: settings
            })
        }).catch((error) => {
            console.error(error)
        })

        
        let intt = window.setInterval(()=>{    //fills the input fields
            if (thisC.state.settings["period"] != undefined) {
                document.getElementById("period").value = this.state.settings["period"];
                document.getElementById("commissionPercentage").value =  this.state.settings["commissionPercentage"];
                document.getElementById("surcharge").value =  this.state.settings["surcharge"] ;
                document.getElementById("minCommission").value =  this.state.settings["minimumCommission"];
                document.getElementById("buysellMargin").value =  this.state.settings["buysellMargin"] ;
                window.clearInterval(intt);
            }
        },100)

        

        

    }

    update () {         //updates the settings config 
        let thisC = this;
        if (document.getElementById("period").value!=""&&document.getElementById("commissionPercentage").value!=""&&document.getElementById("surcharge").value!=""&&
            document.getElementById("minCommission").value!=""&&document.getElementById("buysellMargin").value!="") {
            function getCookie(name) {
                let cookieValue = null;
                    if (document.cookie && document.cookie !== '') {
                        let cookies = document.cookie.split(';');
                        for (let i = 0; i < cookies.length; i++) {
                            let cookie = $.trim(cookies[i]);
                            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                                cookieValue =   decodeURIComponent(cookie.substring(name.length + 1));
                                break;
                            }
                        }
                    }
                    return cookieValue;
            }
            let csrftoken = getCookie('csrftoken');

            document.getElementsByClassName("lds-roller")[0].style.display = "inline-block";
                
                

            let period = document.getElementById("period").value;
            let cP = document.getElementById("commissionPercentage").value;
            let surcharge = document.getElementById("surcharge").value;
            let minC = document.getElementById("minCommission").value;
            let bsMargin = document.getElementById("buysellMargin").value;

            let form = "period="+period+"&commissionPercentage="+cP+"&surcharge="+surcharge+"&minimumCommission="+minC+"&buysellMargin="+bsMargin;

            
                
            let xhttp1 = new XMLHttpRequest(); //uses ajax
            xhttp1.onreadystatechange = function() { 

                if (this.readyState === 4 && this.status === 200 && this.responseText=="SUCCESS") {
                        
                            console.log(this.responseText);
                            document.getElementsByClassName("lds-roller")[0].style.display = "none";
                            document.getElementById("checkmark2").style.display = "block";
                            let intt = window.setInterval(()=>{
                                document.getElementById("checkmark2").style.display = "none";
                                window.clearInterval(intt);
                            },2000)
                        
                }
            };

            xhttp1.open("POST", "/update/", true);
            xhttp1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp1.setRequestHeader("X-CSRFToken", csrftoken);
            xhttp1.send(form);
            console.log("HERE");

        } else {
            alert("please fill all the fields");
        }


    }

    


    render() {
        let thisC = this;

        function goBackOver() {  //hover animation
            document.getElementById("as3").style.top = "3vw";
            document.getElementById("goBack").style.color = "white";

        }

        function goBackOut() {  //hover out animation
            document.getElementById("as3").style.top = "-10vw";
            document.getElementById("goBack").style.color = "#87b0de";

        }

        return (
            <div className="mainAdmin">
                <img className="aNav" src={nav}></img>
                <div className="adminHead"> 
                    Adjust Settings
                </div>
                <img className="as3" src={as3} id="as3" ></img>
                <div className="agoBack" onClick={()=>{window.location.href = "/"}} onMouseOver={goBackOver} onMouseOut={goBackOut} id="goBack" >
                    go back home
                </div>

                
                <div className="settingsTab">
                    <img className="as1" src={as1}></img>
                    <i className="fa fa-cog cogIcon" aria-hidden="true"></i>

                    <div className="settingsFields">

                        <div className="aField">
                            <p className="aPage">Update Period of the Exchange Rates: </p>
                            <input className="aInput" id="period" type="number" name="period"></input>
                            <div className="birim">s</div>

                        </div><br></br>
                        <div className="aField">
                            <p className="aPage">Commission Percentage: </p>
                            <input className="aInput" id="commissionPercentage" type="number" name="commissionPercentage"></input>
                            <div className="birim">%</div>
                            
                        </div><br></br>
                        <div className="aField">
                            <p className="aPage">
                                Surcharge: </p>
                            <input className="aInput" id="surcharge" type="number" name="surcharge"></input>
                            <div className="birim">$</div>
                            
                        </div><br></br>
                        <div className="aField">
                            <p className="aPage">Minimum Commission: </p>
                            <input className="aInput" id="minCommission" type="number" name="minCommission"></input>
                            <div className="birim">$</div>
                            
                        </div><br></br>
                        <div className="aField">
                            <p className="aPage">Buy-Sell Margin Rate: </p>
                            <input className="aInput" id="buysellMargin" type="number" name= "buysellMargin"></input>
                            <div className="birim">%</div>
                            
                        </div><br></br>

                        <button className="update" onClick={this.update}><p className="update1" >Update</p>
                        
                        </button>

                        <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>

                        <svg className="checkmark1 cM2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" id="checkmark2">
                                <circle className="checkmark__circle1" cx="26" cy="26" r="25" fill="none"/>
                                <path className="checkmark__check1" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                        </svg>
                        

                    </div>

                </div>


            </div>
        )
    }
}


export default Admin;