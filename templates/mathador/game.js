// let is_game_running = true;
const page_tag = {
    player_position_tag: null,
    next_case_position: null,
};
const player_id = {{ player_id }};

function remove_body_child(tag_to_deleted ) {
    document.body.removeChild(tag_to_deleted);
}

function extract_player_from_id(player_id, game_state) {
    for (let i=0; i<game_state.players.length; i++) {
        if (game_state.players[i].id === player_id) {
            return game_state.players[i];
        }
    }
    return undefined;
}

function get_case_from_its_position(case_number, game_state) {
    /*
    for (let i=0; i<game_state.cases.length; i++) {
        if (game_state.cases[i].case_number_on_board === i) {
            return game_state.cases[i]
        }
    }
    return undefined;
     */
    return game_state.cases[case_number-1];
}

function get_case_operation_from_its_position(case_number, game_state) {
    const player_case = get_case_from_its_position(case_number, game_state);
    return [ player_case.mandatory_operation, player_case.optional_operation];
}

function add_new_tag_in_body(element) {
    document.body.appendChild(element);
}

function send_start_turn_request() {
    function create_movement_text(movement_text_tag, number_case_moving) {
        movement_text_tag.textContent = "tu as avancé de " + number_case_moving + " case";
        if (number_case_moving > 1) {
            movement_text_tag.textContent += 's';
        }
        movement_text_tag.textContent += '.';
    }

    function create_operation_text(data, numberCaseMoving, operation_tag) {
        const player = extract_player_from_id(player_id, data);
        const case_number = player.on_the_case + numberCaseMoving;
        const mandatory_operation = get_case_operation_from_its_position(case_number, data);
        if (mandatory_operation[1] === '.') {
            operation_tag.textContent = "l'opération obligatoire est le " + mandatory_operation[0] + '.';
        } else {
            operation_tag.textContent = "les opérations obligatoires sont le " + mandatory_operation[0] + ' et le ' + mandatory_operation[1] + '.';
        }
    }

    fetch("{% url 'math:start_turn' player_id %}").then(
        data => {
            return data.json();
        })
        .then(
            data => {
                const numberCaseMoving = data.moving_dice.last_number_throw;

                remove_body_child(page_tag.button_start_turn);

                const movement_text_tag = page_tag.amount_movement_by_movement_dice;
                add_new_tag_in_body(movement_text_tag);
                create_movement_text(movement_text_tag, numberCaseMoving);

                const operation_tag = page_tag.mandatory_operation;
                add_new_tag_in_body(operation_tag);

                create_operation_text(data, numberCaseMoving, operation_tag);

                add_new_tag_in_body(page_tag.button_throw_dice);
            }
        );
}

function send_throw_dice_request() {
    function extract_available_numbers(json) {
        const available_numbers = []
        const number_dices = json.dices;
        for (let i = 0; i < number_dices.length; i++) {
            available_numbers.push(number_dices[i].last_number_throw)
        }
        return available_numbers;
    }

    fetch("{% url 'math:throw_enigm_dices' player_id %}").then(
        data => {
            return data.json();
        })
        .then(
            json => {
                console.log(json);
                remove_body_child(page_tag.button_throw_dice);

                result = json.result_dice.last_number_throw
                const available_numbers = extract_available_numbers(json);

                page_tag.objective_dice_text.textContent = "objectif à atteindre: " + result
                page_tag.available_number_text.textContent = "avec " + available_numbers.join(' ') + '.'
                add_new_tag_in_body(page_tag.objective_dice_text)
                add_new_tag_in_body(page_tag.available_number_text)
            }
        )
}

function create_tag() {
    page_tag.player_position_tag = document.querySelector(".player_position");
    page_tag.next_case_position = document.querySelector("ul.next_case_positions");
    page_tag.button_start_turn = document.createElement("button");
    page_tag.button_throw_dice = document.createElement("button");
    page_tag.amount_movement_by_movement_dice = document.createElement("p");
    page_tag.mandatory_operation = document.createElement("p");
    page_tag.objective_dice_text = document.createElement("p");
    page_tag.available_number_text = document.createElement("p");
}

function initialize_tag() {
    page_tag.button_start_turn.textContent = "Se déplacer";
    page_tag.button_start_turn.addEventListener("click", send_start_turn_request);

    page_tag.button_throw_dice.textContent = "lancer les dés";
    page_tag.button_throw_dice.addEventListener("click", send_throw_dice_request);

}

function initialize_global_tag_var() {
    create_tag();
    initialize_tag();

    add_new_tag_in_body(page_tag.button_start_turn)
}


window.addEventListener("DOMContentLoaded", () => {
        initialize_global_tag_var();
    }
);
