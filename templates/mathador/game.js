// let is_game_running = true;
const page_tag = {
    player_position_tag: null,
    next_case_position: null,
};
const player_id = {{ player_id }};
const operation_data = {
    operations_list: []
};

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

function use_number_in_operation(event) {

    function move_to_tag(target, button_tag = event.target) {
        const tag_content = button_tag.textContent;
        const page_tag_buttons_tag = page_tag.operation_form.available_number_tags.numbers_tag;
        target.textContent = tag_content;

        const index = page_tag_buttons_tag.indexOf(button_tag);
        if (index > -1) {
            page_tag_buttons_tag.splice(index, 1);
        }
        button_tag.remove();

    }

    const operation_container = page_tag.operation_form.operation_content.element_tag;

    if (operation_container.number_1.textContent === "") {
        move_to_tag(operation_container.number_1);
    } else if (operation_container.number_2.textContent === "") {
        move_to_tag(operation_container.number_2);
    }

}

function update_as_available_number_in_operation(new_tag, tag_content) {
    new_tag.textContent = tag_content;
    new_tag.type = "button";

    page_tag.operation_form.available_number_tags.numbers_tag.push(new_tag);
    page_tag.operation_form.available_number_tags.tag.appendChild(new_tag);
    new_tag.addEventListener("click", use_number_in_operation);
}

function remove_number_in_operation(event) {
    const target_tag = event.target;
    if (target_tag.textContent === "") {
        return;
    }

    const new_tag = document.createElement("button");
    update_as_available_number_in_operation(new_tag, target_tag.textContent);

    target_tag.textContent = "";
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
            update_as_available_number_in_operation(button_tag, available_numbers[i].toString())
        }
    }

    function add_operation_configurations() {


        const tags = page_tag.operation_form.operation_content;
        const operation_number_1 = tags.element_tag.number_1;
        const operation_number_2 = tags.element_tag.number_2;

        operation_number_1.textContent = "";
        operation_number_2.textContent = "";
    }

    function add_confirmation_buttons() {
        // const tags = page_tag.operation_form.buttons;
    }

    fetch("{% url 'math:throw_enigm_dices' player_id %}").then(
        data => {
            return data.json();
        })
        .then(
            json => {

                const global_section = page_tag.operation_form.global_tag;
                document.body.appendChild(global_section);

                const available_number = extract_available_numbers(json);
                add_available_number_buttons(available_number, json.result_dice.last_number_throw);
                add_operation_configurations();
                add_confirmation_buttons();
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
                number_1: document.createElement("button"),
                operator: document.createElement("select"),
                number_2: document.createElement("button")
            }
        },
        buttons: {
            tag: document.createElement("div"),
            buttons_tag: {
                submit: document.createElement("button"),
                confirm_operation: document.createElement("button"),
                reset_1: document.createElement("button"),
                reset_all: document.createElement("button")
            }

        }
    }
}

function confirm_single_operation(event) {
    function put_up_to_date_result(operation) {
        if (operation.operation_done === "add") {
            operation.operation_done = "+";
            operation.result = operation.number_1 + operation.number_2;
        }
        if (operation.operation_done === "mul") {
            operation.operation_done = "*";
            operation.result = operation.number_1 * operation.number_2;
        }
        if (operation.operation_done === "div") {
            operation.operation_done = "/";
            operation.result = operation.number_1 / operation.number_2;
        }
        if (operation.operation_done === "sub") {
            operation.operation_done = "-";
            operation.result = operation.number_1 - operation.number_2;
        }
    }

    function update_available_numbers(operation, available_number_tag) {
        function update_operation_object() {
            available_number_tag.numbers_tag.forEach((element) => {
                const number = Number(element.textContent);
                operation.available_number_after_operation.push(number);
            })
            operation.available_number_after_operation.push(operation.result);
        }

        function update_document_tag() {
            const new_available_number = document.createElement("button");
            update_as_available_number_in_operation(new_available_number, operation.result.toString());
        }

        update_operation_object();
        update_document_tag();

    }

    event.preventDefault();
    const operation_tag = page_tag.operation_form.operation_content.element_tag;

    if (operation_tag.textContent === "" || operation_tag.number_2.textContent === "") {
        return;
    }

    const operation = {
        operation_done: operation_tag.operator.value,
        number_1: Number(operation_tag.number_1.textContent),
        number_2: Number(operation_tag.number_2.textContent),
        result: null,
        available_number_after_operation: []
    }

    put_up_to_date_result(operation);

    update_available_numbers(operation, page_tag.operation_form.available_number_tags)
    operation_data.operations_list.push(operation);

    operation_tag.number_1.textContent = ""; //numbers are used
    operation_tag.number_2.textContent = "";

    console.log(operation_data);
}

function return_one_operation_back() {
    function removed_operation_numbers() {
        const operation_details = page_tag.operation_form.operation_content.element_tag;
        remove_number_in_operation({target: operation_details.number_1});
        remove_number_in_operation({target: operation_details.number_2});
    }

    function remove_available_number(number) {
        number = number.toString();
        const available_number_on_document = page_tag.operation_form.available_number_tags.numbers_tag;

        let i=0;
        while( i < available_number_on_document.length) {
            const tag_tested = available_number_on_document[i];
            if (tag_tested.textContent === number) {
                tag_tested.remove();
                available_number_on_document.splice(i,1);
            }
            i++;
        }
    }

    function add_available_number(number) {
        number = number.toString();
        const available_number_on_document = page_tag.operation_form.available_number_tags.numbers_tag;

        const new_tag = document.createElement("button");
        update_as_available_number_in_operation(new_tag, number);
        available_number_on_document.push(new_tag);
    }

    if (operation_data.operations_list.length === 0) {
        return;
    }
    const operation_removed = operation_data.operations_list.pop();

    removed_operation_numbers();

    remove_available_number(operation_removed.result);
    add_available_number(operation_removed.number_1);
    add_available_number(operation_removed.number_2);
}

function remove_all_operation() {
    while (operation_data.operations_list.length !== 0) {
        return_one_operation_back();
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
        context_tag.element_tag.number_1.type = "button";
        context_tag.element_tag.number_2.type = "button";
        context_tag.element_tag.text.textContent = "opération:";

        context_tag.element_tag.number_1.addEventListener("click", remove_number_in_operation);
        context_tag.element_tag.number_2.addEventListener("click", remove_number_in_operation);

        add_option_to_select_tag(context_tag.element_tag.operator, "add", "+");
        add_option_to_select_tag(context_tag.element_tag.operator, "sub", "-");
        add_option_to_select_tag(context_tag.element_tag.operator, "mul", "*");
        add_option_to_select_tag(context_tag.element_tag.operator, "div", "/");
    }

    function initialize_button_content_tags() {
        const tag_container = page_tag.operation_form.buttons
        const global_section = tag_container.tag

        const button_submit = tag_container.buttons_tag.submit;
        const button_confirm = tag_container.buttons_tag.confirm_operation;
        const button_reset_1_operation = tag_container.buttons_tag.reset_1;
        const button_reset_all_operation = tag_container.buttons_tag.reset_all;

        global_section.appendChild(button_submit);
        global_section.appendChild(button_confirm);
        global_section.appendChild(button_reset_1_operation);
        global_section.appendChild(button_reset_all_operation);
        button_submit.type = "submit";
        button_submit.textContent = "le compte est bon!"
        button_confirm.type = "submit";
        button_confirm.textContent = "Confirmer l'opérations";
        button_reset_1_operation.type = "reset";
        button_reset_1_operation.textContent = "annuler un mouvement";
        button_reset_all_operation.type = "reset";
        button_reset_all_operation.textContent = "annuler tous les mouvements";

        button_confirm.addEventListener("click", confirm_single_operation);
        button_reset_1_operation.addEventListener("click", return_one_operation_back);
        button_reset_all_operation.addEventListener("click", remove_all_operation);
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


window.addEventListener("DOMContentLoaded", initialize_global_tag_var);
