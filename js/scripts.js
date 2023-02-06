
// let pokemonList=[
//     {name:"Caterpie", height:7, type: ["grass","water"] }, 
//     {name:"Weedle", height:5, type: ["sweet","salty"] }, 
//     {name:"Pidgeotto", height:6, type: ["jungle","air"] } 
// ]



// for (let i = 0;
//          i < pokemonList.length;
//          i++)


// if(pokemonList[i].type[0]==="grass" &&  pokemonList[i].type[1]==="water")  {
//    document.write(pokemonList[i].name + " (type: " + pokemonList[i].type + " ) - Oh! That's a grassy Pokemon!" + "<br>")
// }
// else if (pokemonList[i].type[0]==="sweet"  &&  pokemonList[i].type[1]==="salty"){
//          document.write(pokemonList[i].name + " (type: " + pokemonList[i].type + " ) - Oh! That's a sweet and salty pokemon." + "<br>")
//         }


// else{
//    document.write(pokemonList[i].name + " (type: " + pokemonList[i].type + " ) - Oh! That's not a grassy Pokemon!" + "<br>")

// }





 


    // independent practice
    let pokemonRepository = (function (){
        let pokemonList = [];
        let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
        let modalContainer = document.querySelector('#modal-container');
        
        
        

        function addPokemon(pokemon){
            if (typeof pokemon === 'object' && 'name' in pokemon){
                pokemonList.push(pokemon);
            }else{
                console.log('Not an object!');
            }
        }       
        
        function getAll(){
            return pokemonList;
        }

        
        
        function loadList(){
            return fetch(apiUrl).then( function(response){
                return response.json();
            }).then(function(json){
                json.results.forEach(function(data){
                    let pokemon = {
                        name: capitalFirstLetter(data.name),
                        detailsUrl: data.url,    
                    };
                
                    addPokemon(pokemon);
                });
            }).catch(function(error){
                console.log(error);
            })
        }

        

        function loadDetails(pokemon){
            let url = pokemon.detailsUrl;
            return fetch(url).then(function(response){
                return response.json();
            }).then(function(json){
                pokemon.imageUrl = json.sprites.front_shiny;
                pokemon.height = json.height;
                pokemon.types = json.types.map((type) => type.type.name).join(',');
                
            }).catch(function(error){
                console.log(error);
            });
        }

        

        function addListItem(pokemon){
            let ul = document.querySelector('.pokemon-list');
            let listItem = document.createElement('li');
            let button = document.createElement('button');
            button.innerText = pokemon.name;
            loadDetails(pokemon).then(function(){
            let img = document.createElement('img');
            img.src = pokemon.imageUrl;
            button.appendChild(img);
            
        });
            button.classList.add('pokemon-list__item');        
            button.addEventListener('click', function(){
                showDetails(pokemon);
            });
            
            listItem.appendChild(button);
            ul.appendChild(listItem);
    
        }

        function showModal(pokemon){
            let modalContainer = document.querySelector('#modal-container');
            modalContainer.innerHTML = '';

            let modal = document.createElement('div');
            modal.classList.add('modal');

            let closeButton = document.createElement('button');
            closeButton.classList.add('modal-close');
            closeButton.innerText = 'Close';
            closeButton.addEventListener('click', hideModal);

            
            let nameElement = document.createElement("h1");
            nameElement.innerText = pokemon.name;

            let heightElement = document.createElement("p");
            heightElement.innerText = pokemon.height;
            
            let typesElement = document.createElement("p");
            typesElement.innerText = pokemon.types;


            let imageInModal = document.createElement('img');
            imageInModal.src = pokemon.imageUrl;
            imageInModal.alt = 'Pokemon Image';

            modal.appendChild(closeButton);
            modal.appendChild(nameElement);
            modal.appendChild(heightElement);
            modal.appendChild(typesElement);
            modal.appendChild(imageInModal);
            modalContainer.appendChild(modal);
 
            modalContainer.classList.add('is-visible');

        }

        function hideModal(){
            modalContainer.classList.remove('is-visible');
        }

        window.addEventListener('keydown', (e) => {
            if(e.key === 'Escape' && modalContainer.classList.contains('is-visible')){
                hideModal();
            }
        });

        modalContainer.addEventListener('click', (e) =>{
            let target = e.target;
            if(target === modalContainer){
                hideModal();
            }
        })


        function showDetails(pokemon){
            loadDetails(pokemon).then(function(){
            showModal(pokemon);
            console.log(pokemon);
    });
    }

       

    function capitalFirstLetter(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    

        return{
            addPokemon:addPokemon,
            getAll:getAll,
            addListItem:addListItem,
            loadList:loadList,
            loadDetails:loadDetails,
            showDetails:showDetails,
            showModal:showModal
        };
    })();

    console.log(pokemonRepository.getAll());

    pokemonRepository.loadList().then(function(){
    pokemonRepository.getAll().forEach(function(pokemon){
        pokemonRepository.addListItem(pokemon);
    });
});