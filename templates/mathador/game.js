// let is_game_running = true;
const page_tag = {
    player_position_tag: null,
    next_case_position: null,
};
const player_id = {{ player_id }};
const operation_data = {};

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

function clean_tag_content(global_section) {
    global_section.innerHTML = "";
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

    function add_available_number_buttons(available_numbers, objective) {
        const global_section = page_tag.operation_form.available_number_tags;
        clean_tag_content(global_section.tag);
        global_section.tag.textContent = "il faut faire " + objective + " avec: "
        for (let i = 0; i < available_numbers.length; i++) {
            const button_tag = document.createElement("button");
            button_tag.type = "button";
            global_section.numbers_tag.push(button_tag);
            global_section.tag.appendChild(button_tag);
            button_tag.textContent = available_numbers[i].toString();
        }
    }

    function add_operation_configurations() {


        const tags = page_tag.operation_form.operation_content;
        const operation_number_1 = tags.element_tag.number_1;
        const operation_number_2 = tags.element_tag.number_2;

        operation_number_1.value = "";
        operation_number_2.value = "";
    }

    function add_confirmation_buttons(global_section) {
        const tags = page_tag.operation_form.buttons;
    }

    function initialize_operation_data(json) {
        function convert_to_local_mandatory_operation_object(operation_name) {
            return {
                operation: operation_name,
                has_used: false
            }
        }

        remove_body_child(page_tag.button_throw_dice);

        operation_data.available_number = extract_available_numbers(json);
        operation_data.awaited_result = json.result_dice.last_number_throw;
        const list_of_mandatory_operation = [];
        const player = extract_player_from_id(player_id, json);
        const case_number = player.on_the_case + json.moving_dice.last_number_throw;
        const case_for_mandatory_operation = get_case_from_its_position(case_number, json);
        list_of_mandatory_operation.push(convert_to_local_mandatory_operation_object(case_for_mandatory_operation.mandatory_operation));
        if (case_for_mandatory_operation.optional_operation !== ".") {
            list_of_mandatory_operation.push(convert_to_local_mandatory_operation_object(case_for_mandatory_operation.optional_operation));
        }
        operation_data.mandatory_operation = list_of_mandatory_operation;
    }

    fetch("{% url 'math:throw_enigm_dices' player_id %}").then(
        data => {
            return data.json();
        })
        .then(
            json => {
                initialize_operation_data(json);

                console.log(json);
                console.log(operation_data);

                const global_section = page_tag.operation_form.global_tag;
                document.body.appendChild(global_section);

                add_available_number_buttons(operation_data.available_number, json.result_dice.last_number_throw);
                add_operation_configurations(global_section);
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
    page_tag.operation_form = {
        global_tag: document.createElement("form"),
        available_number_tags: {
            tag: document.createElement("div"),
            numbers_tag: []
        },
        operation_content: {
            tag: document.createElement("div"),
            element_tag: {
                text: document.createElement("p"),
                number_1: document.createElement("input"),
                operator: document.createElement("select"),
                number_2: document.createElement("input")
            }
        },
        buttons: {
            tag: document.createElement("div"),
            buttons_tag: {
                confirmation: document.createElement("input"),
                reset_1: document.createElement("input"),
                reset_all: document.createElement("input")
            }

        }
    }
}

function initialize_tag() {
    function initialize_operation_content_tags() {
        function add_option_to_select_tag(select_tag, value, text_shown) {
            let option_select = document.createElement("option");
            option_select.value = value;
            option_select.textContent = text_shown;
            select_tag.appendChild(option_select);
        }

        const context_tag = page_tag.operation_form.operation_content;
        context_tag.tag.appendChild(context_tag.element_tag.text);
        context_tag.tag.appendChild(context_tag.element_tag.number_1);
        context_tag.tag.appendChild(context_tag.element_tag.operator);
        context_tag.tag.appendChild(context_tag.element_tag.number_2);
        context_tag.element_tag.number_1.readOnly = true;
        context_tag.element_tag.number_2.readOnly = true;
        context_tag.element_tag.text.textContent = "opération:";

        add_option_to_select_tag(context_tag.element_tag.operator, "add", "+");
        add_option_to_select_tag(context_tag.element_tag.operator, "sub", "-");
        add_option_to_select_tag(context_tag.element_tag.operator, "mul", "*");
        add_option_to_select_tag(context_tag.element_tag.operator, "div", "/");
    }

    function initialize_button_content_tags() {
        const tag_container = page_tag.operation_form.buttons
        const global_section = tag_container.tag

        const button_submit = tag_container.buttons_tag.confirmation;
        const button_reset_1_operation = tag_container.buttons_tag.reset_1;
        const button_reset_all_operation = tag_container.buttons_tag.reset_all;

        global_section.appendChild(button_submit);
        global_section.appendChild(button_reset_1_operation);
        global_section.appendChild(button_reset_all_operation);
        button_submit.type = "submit";
        button_reset_1_operation.type = "reset";
        button_reset_all_operation.type = "reset";
    }

    page_tag.button_start_turn.textContent = "Se déplacer";

    page_tag.button_start_turn.addEventListener("click", send_start_turn_request);
    page_tag.button_throw_dice.textContent = "lancer les dés";

    page_tag.button_throw_dice.addEventListener("click", send_throw_dice_request);
    page_tag.operation_form.global_tag.appendChild(page_tag.operation_form.available_number_tags.tag);
    page_tag.operation_form.global_tag.appendChild(page_tag.operation_form.operation_content.tag);
    initialize_operation_content_tags();
    initialize_button_content_tags();

    page_tag.operation_form.global_tag.appendChild(page_tag.operation_form.buttons.tag);
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
