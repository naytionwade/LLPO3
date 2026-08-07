let collection = JSON.parse(
    localStorage.getItem("collection")
) || {};


let coins = Number(
    localStorage.getItem("coins")
) || 0;


let currentPlayer = null;


let packLocked = false;


let timerInterval;





const cardDisplay = document.getElementById("cardDisplay");

const collectionDisplay = document.getElementById("collection");

const coinDisplay = document.getElementById("coins");

const sellArea = document.getElementById("sellArea");

const timer = document.getElementById("timer");

const walkout = document.getElementById("walkout");









function updateCoins(){


    coinDisplay.innerHTML =

    coins.toLocaleString();



    localStorage.setItem(

        "coins",

        coins

    );


}



updateCoins();









function cardID(player){


    return (

        player.name +

        "_" +

        player.rating

    );


}









function getSellPrice(rating){



    if(rating == 99) return 500000;


    if(rating == 98) return 100000;


    if(rating >= 96) return 50000;


    if(rating >= 94) return 20000;


    if(rating >= 92) return 15000;


    if(rating >= 90) return 10000;


    if(rating == 89) return 5000;


    if(rating == 88) return 2000;


    if(rating == 87) return 1500;


    if(rating == 86) return 1000;


    if(rating == 85) return 750;


    if(rating == 84) return 500;


    if(rating == 82 || rating == 83) return 250;



    return 150;


}









function rarity(rating){



    if(rating == 99) return "icon";


    if(rating >= 96) return "legendary";


    if(rating >= 92) return "elite";


    if(rating >= 89) return "moreRare";


    if(rating >= 85) return "rare";


    if(rating >= 82) return "uncommon";



    return "common";


}
function packPrice(pack){


    if(pack == "bronze") return 0;


    if(pack == "silver") return 1500;


    if(pack == "gold") return 15000;


    if(pack == "ultimate") return 50000;



    return 0;


}









function getPlayer(pack){



    let chance = Math.random();


    let pool = [];








    // BRONZE
    // Mostly 80 or below


   
    if(pack == "bronze"){


    if(chance < 0.90){

        pool = cards.filter(
            p => p.rating <= 81
        );

    }


    else if(chance < 0.98){

        pool = cards.filter(
            p => p.rating >= 82 &&
            p.rating <= 84
        );

    }


    else{

        pool = cards.filter(
            p => p.rating >= 85
        );

    }

}








    // SILVER
    // Mostly 82-87


    if(pack == "silver"){


        if(chance < 0.25){


            pool = cards.filter(

                p => p.rating <= 81

            );


        }


        else if(chance < 0.80){


            pool = cards.filter(

                p => p.rating >= 82 &&

                p.rating <= 87

            );


        }


        else if(chance < 0.97){


            pool = cards.filter(

                p => p.rating >= 88 &&

                p.rating <= 91

            );


        }


        else{


            pool = cards.filter(

                p => p.rating >= 92

            );


        }


    }









    // GOLD
    // Mostly 85-91


    if(pack == "gold"){


        if(chance < 0.15){


            pool = cards.filter(

                p => p.rating <= 84

            );


        }


        else if(chance < 0.65){


            pool = cards.filter(

                p => p.rating >= 85 &&

                p.rating <= 88

            );


        }


        else if(chance < 0.95){


            pool = cards.filter(

                p => p.rating >= 89 &&

                p.rating <= 91

            );


        }


        else if(chance < 0.995){


            pool = cards.filter(

                p => p.rating >= 92 &&

                p.rating <= 95

            );


        }


        else{


            pool = cards.filter(

                p => p.rating >= 96

            );


        }


    }
        // ULTIMATE PACK
    // Best chances


    if(pack == "ultimate"){



        if(chance < 0.10){


            pool = cards.filter(

                p => p.rating >= 85 &&

                p.rating <= 88

            );


        }


        else if(chance < 0.35){


            pool = cards.filter(

                p => p.rating >= 89 &&

                p.rating <= 91

            );


        }


        else if(chance < 0.70){


            pool = cards.filter(

                p => p.rating >= 92 &&

                p.rating <= 95

            );


        }


        else if(chance < 0.95){


            pool = cards.filter(

                p => p.rating >= 96 &&

                p.rating <= 98

            );


        }


        else{


            pool = cards.filter(

                p => p.rating == 99

            );


        }


    }









    // IF THERE ARE NO PLAYERS IN THAT RANGE


    if(pool.length == 0){


        pool = cards;


    }








    return pool[

        Math.floor(

            Math.random() * pool.length

        )

    ];



}









function openPack(pack){



    if(packLocked){


        timer.innerHTML =

        "Pack opening soon!";


        return;


    }







    let price = packPrice(pack);







    if(coins < price){


        timer.innerHTML =

        "Not enough coins!";


        return;


    }








    coins -= price;


    updateCoins();








    let player = getPlayer(pack);





    currentPlayer = player;







    addCollection(player);



    displayCard(player);



    startTimer();



}









function startTimer(){



    let time = 5;


    packLocked = true;






    timer.innerHTML =

    "Next pack in " + time;






    timerInterval = setInterval(()=>{



        time--;





        if(time <= 0){


            clearInterval(timerInterval);


            packLocked = false;


            timer.innerHTML =

            "Ready!";


        }


        else{


            timer.innerHTML =

            "Next pack in " + time;


        }




    },1000);



}
function addCollection(player){



    let id = cardID(player);





    if(collection[id]){


        collection[id]++;


    }

    else{


        collection[id] = 1;


    }







    localStorage.setItem(

        "collection",

        JSON.stringify(collection)

    );



}









function displayCard(player){



    let style = rarity(

        player.rating

    );







    cardDisplay.innerHTML =



    `

    <div class="player-card ${style}">



    <img src="${player.image}">



    <h1>

    ${player.rating}

    </h1>




    <h2>

    ${player.name}

    </h2>




    <p>

    ${player.position}

    </p>




    </div>

    `;







    sellArea.innerHTML =



    `

    <button class="sellButton"

    onclick="sellCurrentCard()">



    Sell for

    ${getSellPrice(player.rating).toLocaleString()}

    Coins



    </button>


    `;







    if(player.rating >= 89){


        walkout.innerHTML =



        `

        <div class="walkout">

        WALKOUT!

        </div>


        `;




        setTimeout(()=>{


            walkout.innerHTML = "";


        },2500);


    }



    showCollection();


}









function showCollection(){



    collectionDisplay.innerHTML = "";







    for(let id in collection){



        let data = id.split("_");



        let name = data[0];

        let rating = Number(data[1]);







        let player = cards.find(


            p => p.name == name &&

            p.rating == rating


        );







        if(!player) continue;







        collectionDisplay.innerHTML +=



        `

        <div class="collection-card">



        <img src="${player.image}">



        <h3>

        ${player.name}

        </h3>




        <p>

        Rating: ${player.rating}

        </p>




        <p>

        Owned: ${collection[id]}

        </p>




        <p>

        Sell:

        ${getSellPrice(player.rating).toLocaleString()}

        Coins

        </p>




        <button onclick="sellCard('${id}')">

        SELL

        </button>




        </div>

        `;



    }



}









function sellCard(id){



    let data = id.split("_");



    let name = data[0];

    let rating = Number(data[1]);







    let player = cards.find(


        p => p.name == name &&

        p.rating == rating


    );







    if(!player) return;







    coins += getSellPrice(

        player.rating

    );







    collection[id]--;







    if(collection[id] <= 0){


        delete collection[id];


    }







    localStorage.setItem(

        "collection",

        JSON.stringify(collection)

    );







    updateCoins();


    showCollection();



}









function sellCurrentCard(){



    if(!currentPlayer) return;






    let id = cardID(currentPlayer);






    sellCard(id);






    sellArea.innerHTML =

    "<h2>Sold!</h2>";



}









updateCoins();

showCollection();

const music = document.getElementById("music");

document.addEventListener("click", () => {
    music.play().catch(err => console.log(err));
}, { once: true });