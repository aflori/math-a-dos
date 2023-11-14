// let is_game_running = true;
const page_tag = {
    player_position_tag: null,
    next_case_position: null,
};
const player_id = {{ player_id }};

function remove_body_child(tag_to_deleted) {
    document.body.removeChild(tag_to_deleted);
}

function add_new_tag_in_body(element) {
    document.body.appendChild(element);
}

function extract_player_from_id(player_id, game_state) {
    for (let i = 0; i < game_state.players.length; i++) {
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
    return game_state.cases[case_number - 1];
}

function get_case_operation_from_its_position(case_number, game_state) {
    const player_case = get_case_from_its_position(case_number, game_state);
    return [player_case.mandatory_operation, player_case.optional_operation];
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

function clean_tag_content(tag) {
    tag.innerHTML = ""
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

    function add_available_number_buttons(available_numbers, global_section) {
        const available_number_tags_list = []
        for (let i = 0; i < available_numbers.length; i++) {
            const button_tag = document.createElement("button");
            available_number_tags_list.push(button_tag);
            global_section.appendChild(button_tag);
            button_tag.textContent = available_numbers[i].toString();
        }
    }

    function add_a_line_break(global_section) {
        global_section.appendChild(document.createElement("br"));
    }

    function add_operation_configurations(global_section) {
        function add_option_to_select_tag(select_tag, value, text_shown) {
            let option_select = document.createElement("option");
            option_select.value = value;
            option_select.textContent = text_shown;
            select_tag.appendChild(option_select);
        }

        const operation_text = document.createElement("p");
        const operation_number_1 = document.createElement("input");
        const operation_type = document.createElement("select");
        const operation_number_2 = document.createElement("input");

        operation_number_1.readOnly = true;
        operation_number_2.readOnly = true;

        operation_text.textContent = "opération voulue:";

        add_option_to_select_tag(operation_type, "add", "+");
        add_option_to_select_tag(operation_type, "sub", "-");
        add_option_to_select_tag(operation_type, "mul", "*");
        add_option_to_select_tag(operation_type, "div", "/");

        global_section.appendChild(operation_text);
        global_section.appendChild(operation_number_1);
        global_section.appendChild(operation_type);
        global_section.appendChild(operation_number_2);
    }

    function add_confirmation_buttons(global_section) {
        const button_submit = document.createElement("input");
        button_submit.type = "submit";
        const button_reset_1_operation = document.createElement("input");
        button_reset_1_operation.type = "reset";
        const button_reset_all_operation = document.createElement("input")
        button_reset_all_operation.type = "reset";
        global_section.appendChild(button_submit);
        global_section.appendChild(button_reset_1_operation);
        global_section.appendChild(button_reset_all_operation);
    }

    fetch("{% url 'math:throw_enigm_dices' player_id %}").then(
        data => {
            return data.json();
        })
        .then(
            json => {
                console.log(json);
                remove_body_child(page_tag.button_throw_dice);

                const available_numbers = extract_available_numbers(json);
                const awaited_result = json.result_dice.last_number_throw;
                console.log(awaited_result);

                const global_section = document.createElement("form");
                document.body.appendChild(global_section);

                add_available_number_buttons(available_numbers, global_section);
                add_a_line_break(global_section);
                add_operation_configurations(global_section);
                add_a_line_break(global_section);
                add_confirmation_buttons(global_section);
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
    // page_tag.operation_content = {
    //     tag: document.createElement("section"),
    //     list_number_available: {
    //         tag: document.createElement("div"),
    //         list_number: []
    //     },
    //     form_to_make_operation: {
    //         tag: null, // will be done later
    //         list_field: [],
    //         buttons: []
    //     }
    // };
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
