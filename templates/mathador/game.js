// const player = {{ player | safe }};
// const game_id = {{  game.id }};
let is_game_running = true;
const page_tag = {
    player_position_tag: null,
    next_case_position: null
};

function send_start_turn_request(element) {
    fetch("{% url 'math:start_turn' player_id %}").then(
        data => console.log(data.json())
    );
}

function send_throw_dice_request(element) {

}

function create_tag() {
    page_tag.player_position_tag = document.querySelector(".player_position");
    page_tag.next_case_position = document.querySelector("ul.next_case_positions");
    page_tag.button_start_turn = document.createElement("button");
    page_tag.button_throw_dice = document.createElement("button");
}

function initialize_tag() {
    page_tag.button_start_turn.textContent = "Se déplacer";
    page_tag.button_start_turn.addEventListener("click", send_start_turn_request);

    document.body.appendChild(page_tag.button_start_turn)

    page_tag.button_throw_dice.textContent = "lancer les dés";
    page_tag.button_throw_dice.addEventListener("click", send_throw_dice_request)

}

function initialize_global_tag_var() {
    create_tag();
    initialize_tag();
}



window.addEventListener("DOMContentLoaded", (event) => {
        initialize_global_tag_var();
    }
);