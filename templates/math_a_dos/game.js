// let is_game_running = true;
const html_element = {
    page_tag: {
        player_position_tag: null,
        next_case_position: null,
    },

    event_listener_functions: {
        move_action: function (event) {
            fetch("{% url 'math:start_turn' player_id %}").then(
                data => {
                    return data.json();
                })
                .then(
                    json_data => {
                        game_data.game = json_data;
                        const numberCaseMoving = game_data.util.number_case_moved;

                        html_element.document_utils_function.remove_body_child(html_element.page_tag.button_start_turn);

                        html_element.document_utils_function.update_movement_text_in_tag_and_show_on_page(numberCaseMoving);

                        html_element.document_utils_function.update_mandatory_operation_text_in_tag_and_show_on_page(numberCaseMoving);

                        html_element.document_utils_function.add_new_tag_in_body(html_element.page_tag.button_throw_dice);
                    }
                );
        },

        send_throw_dice_request: function (event) {
            fetch("{% url 'math:throw_enigm_dices' player_id %}").then(
                data => {
                    html_element.document_utils_function.remove_button_throw_dice();
                    return data.json();
                }
            ).then(
                json => {
                    game_data.game = json;

                    html_element.document_utils_function.show_operation_section_on_page();

                    html_element.document_utils_function.set_initial_operation_section();
                    html_element.document_utils_function.empty_operation_field();
                }
            );
        },

        use_number_in_operation: function (event) {
            html_element.document_utils_function.move_available_number_to_used_number_empty_tag(event.target);
        },
        remove_number_in_operation: function (event) {
            html_element.document_utils_function.move_used_number_to_available_number(event.target);
        },
    },

    document_utils_function: {
        clean_tag_content: function (tag_to_clean) {
            tag_to_clean.innerHTML = "";
        },

        remove_body_child: function (tag_to_deleted) {
            document.body.removeChild(tag_to_deleted);
        },

        add_new_tag_in_body: function (element) {
            document.body.appendChild(element);
        },

        update_tag_text_content: function(tag, textContent) {
            tag.textContent = textContent
        },

        remove_button_throw_dice: function() {
            this.remove_body_child(html_element.page_tag.button_throw_dice);
        },

        update_movement_text_in_tag_and_show_on_page: function (number_of_case) {
            const movement_text_tag = html_element.page_tag.amount_movement_by_movement_dice;
            
            this.add_new_tag_in_body(movement_text_tag);

            movement_text_tag.textContent = "tu as avancé de " + number_of_case + " case";
            if (number_of_case > 1) {
                movement_text_tag.textContent += 's';
            }
            movement_text_tag.textContent += '.';
        },
        update_mandatory_operation_text_in_tag_and_show_on_page: function (numberCaseMoving) {
            const operation_tag = html_element.page_tag.mandatory_operation;

            this.add_new_tag_in_body(operation_tag);

            const player = game_data.util.extract_player_from_id(game_data.player_id);
            const operation_case_number = player.on_the_case + numberCaseMoving;
            const mandatory_operation = game_data.util.get_operation_of_case(operation_case_number);

            const missing_operation_symbole = '.';

            if (mandatory_operation[1] === missing_operation_symbole) {
                operation_tag.textContent = "l'opération obligatoire est le " + mandatory_operation[0] + '.';
            } else {
                operation_tag.textContent = "les opérations obligatoires sont le " + mandatory_operation[0] + ' et le ' + mandatory_operation[1] + '.';
            }
        },

        show_operation_section_on_page: function () {
            const operation_section = html_element.page_tag.operation_form.global_tag;
            this.add_new_tag_in_body(operation_section);
        },
        set_initial_operation_section: function () {
            this.set_objective_on_operation_tag();
            this.set_available_number_from_game_data();
        },
        set_objective_on_operation_tag: function() {
            const available_number_tag = html_element.page_tag.operation_form.available_number_tags.tag;
            const objective = game_data.util.awaited_result_for_operation;

            this.clean_tag_content(available_number_tag);
            available_number_tag.textContent = "il faut faire " + objective + " avec: ";
        },
        set_available_number_from_game_data: function() {
            const available_numbers = game_data.util.available_numbers_for_operation;

            available_numbers.forEach(
                number => {
                    this.create_new_available_number_tag(number);
                }
            );
        },
        empty_operation_field: function() {
            const tags = html_element.page_tag.operation_form.operation_content;
            const operation_number_1 = tags.element_tag.number_1;
            const operation_number_2 = tags.element_tag.number_2;

            operation_number_1.textContent = "";
            operation_number_2.textContent = "";
        },

        move_available_number_to_used_number_empty_tag: function(tag_to_move) {
            const operation_container = html_element.page_tag.operation_form.operation_content.element_tag;

            if (operation_container.number_1.textContent === "") {
                this.move_available_number_to_used_number(operation_container.number_1, tag_to_move);
            } else if (operation_container.number_2.textContent === "") {
                this.move_available_number_to_used_number(operation_container.number_2, tag_to_move);
            }
        },
        move_available_number_to_used_number: function(target_tag, origin_tag) {
            const tag_content = origin_tag.textContent;
        
            this.update_tag_text_content(target_tag, tag_content);
            this.remove_from_available_number_in_operation(origin_tag);            
        },
        remove_from_available_number_in_operation: function(tag_to_remove) {
            const page_tag_buttons_tag = html_element.page_tag.operation_form.available_number_tags.numbers_tag;
            
            const index = page_tag_buttons_tag.indexOf(tag_to_remove);
            if (index > -1) {
                page_tag_buttons_tag.splice(index, 1);
            }
            tag_to_remove.remove();
        },

        create_new_available_number_tag: function(number) {
            const new_tag = document.createElement("button");
            new_tag.textContent = number.toString();
            new_tag.type = "button";

            html_element.page_tag.operation_form.available_number_tags.numbers_tag.push(new_tag);
            html_element.page_tag.operation_form.available_number_tags.tag.appendChild(new_tag);
            new_tag.addEventListener("click", html_element.event_listener_functions.use_number_in_operation);
        },
        move_used_number_to_available_number: function(used_tag) {
            if (used_tag.textContent === "") {
                return;
              }

            this.create_new_available_number_tag(used_tag.textContent);

            used_tag.textContent = "";
        } 

    }
};

const game_data = {
    player_id: {{ player_id }},
    _game: undefined, //updapted after the first request
    operations_list: [],


    get game(){
        return this._game;
    },
    set game(game_data) {
        this._game = game_data;
    },


    util: {
        get number_case_moved() {
            return game_data.game.moving_dice.last_number_throw;
        },

        get available_numbers_for_operation() {

            const available_numbers = []
            const number_dices = game_data.game.dices;
            
            number_dices.forEach(
                dice => {
                    available_numbers.push(dice.last_number_throw)
                }
            )
            return available_numbers;
        },

        get awaited_result_for_operation() {
            return game_data.game.result_dice.last_number_throw;
        },

        extract_player_from_id: function (player_id) {
            for (let i = 0; i < game_data.game.players.length; i++) {
                if (game_data.game.players[i].id === player_id) {
                    return game_data.game.players[i];
                }
            }
        },

        get_case_number: function (case_number) {
            return game_data.game.cases[case_number - 1];
        },
        get_operation_of_case: function (case_number) {
            const player_case = game_data.util.get_case_number(case_number);
            return [player_case.mandatory_operation, player_case.optional_operation];
        }
    }
};


function create_tag() {
    html_element.page_tag.player_position_tag = document.querySelector(".player_position");
    html_element.page_tag.next_case_position = document.querySelector("ul.next_case_positions");
    html_element.page_tag.button_start_turn = document.createElement("button");
    html_element.page_tag.button_throw_dice = document.createElement("button");
    html_element.page_tag.amount_movement_by_movement_dice = document.createElement("p");
    html_element.page_tag.mandatory_operation = document.createElement("p");
    html_element.page_tag.operation_form = {
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
            const number = operation.result;
            html_element.document_utils_function.create_new_available_number_tag(number);
        }

        update_operation_object();
        update_document_tag();

    }

    event.preventDefault();
    const operation_tag = html_element.page_tag.operation_form.operation_content.element_tag;

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

    update_available_numbers(operation, html_element.page_tag.operation_form.available_number_tags)
    game_data.operations_list.push(operation);

    operation_tag.number_1.textContent = ""; //numbers are used
    operation_tag.number_2.textContent = "";

    // console.log(operation_data);
}

function return_one_operation_back() {
    function removed_operation_numbers() {
        const operation_details = html_element.page_tag.operation_form.operation_content.element_tag;
        html_element.event_listener_functions.remove_number_in_operation({target: operation_details.number_1});
        html_element.event_listener_functions.remove_number_in_operation({target: operation_details.number_2});
    }

    function remove_available_number(number) {
        number = number.toString();
        const available_number_on_document = html_element.page_tag.operation_form.available_number_tags.numbers_tag;

        let i=0;
        while( i < available_number_on_document.length) {
            const tag_tested = available_number_on_document[i];
            if (tag_tested.textContent === number) {
                tag_tested.remove();
                available_number_on_document.splice(i,1);
                return;
            }
            i++;
        }
    }

    function add_available_number(number) {
        html_element.document_utils_function.create_new_available_number_tag(number);
    }

    if (game_data.operations_list.length === 0) {
        return;
    }
    const operation_removed = game_data.operations_list.pop();

    removed_operation_numbers();

    remove_available_number(operation_removed.result);
    add_available_number(operation_removed.number_1);
    add_available_number(operation_removed.number_2);
}

function remove_all_operation(event) {
    while (game_data.operations_list.length !== 0) {
        return_one_operation_back();
    }
}
function submit_full_operation(event) {
    event.preventDefault();
    console.log("Event");
    const operations = game_data.operations_list;

    const request_content = {
        method: "POST",
        body: JSON.stringify(operations),
        headers: {
            "Content-Type": "application/json"
        }
    }

    const body_content = {};
    fetch("{% url 'math:confirm_full_operation' player_id %}", request_content).then(
        raw_data => {
            return raw_data.json();
        }).then(
            json => {
                console.log(json);
            }
        );
}

function initialize_tag() {
    function initialize_operation_content_tags() {
        function add_option_to_select_tag(select_tag, value, text_shown) {
            let option_select = document.createElement("option");
            option_select.value = value;
            option_select.textContent = text_shown;
            select_tag.appendChild(option_select);
        }

        const context_tag = html_element.page_tag.operation_form.operation_content;
        context_tag.tag.appendChild(context_tag.element_tag.text);
        context_tag.tag.appendChild(context_tag.element_tag.number_1);
        context_tag.tag.appendChild(context_tag.element_tag.operator);
        context_tag.tag.appendChild(context_tag.element_tag.number_2);
        context_tag.element_tag.number_1.type = "button";
        context_tag.element_tag.number_2.type = "button";
        context_tag.element_tag.text.textContent = "opération:";

        context_tag.element_tag.number_1.addEventListener("click", html_element.event_listener_functions.remove_number_in_operation);
        context_tag.element_tag.number_2.addEventListener("click", html_element.event_listener_functions.remove_number_in_operation);

        add_option_to_select_tag(context_tag.element_tag.operator, "add", "+");
        add_option_to_select_tag(context_tag.element_tag.operator, "sub", "-");
        add_option_to_select_tag(context_tag.element_tag.operator, "mul", "*");
        add_option_to_select_tag(context_tag.element_tag.operator, "div", "/");
    }

    function initialize_button_content_tags() {
        const tag_container = html_element.page_tag.operation_form.buttons
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

        button_submit.addEventListener("click", submit_full_operation);
        button_confirm.addEventListener("click", confirm_single_operation);
        button_reset_1_operation.addEventListener("click", return_one_operation_back);
        button_reset_all_operation.addEventListener("click", remove_all_operation);
    }

    html_element.page_tag.button_start_turn.textContent = "Se déplacer";

    html_element.page_tag.button_start_turn.addEventListener("click", html_element.event_listener_functions.move_action);
    html_element.page_tag.button_throw_dice.textContent = "lancer les dés";

    html_element.page_tag.button_throw_dice.addEventListener("click", html_element.event_listener_functions.send_throw_dice_request);
    html_element.page_tag.operation_form.global_tag.appendChild(html_element.page_tag.operation_form.available_number_tags.tag);
    html_element.page_tag.operation_form.global_tag.appendChild(html_element.page_tag.operation_form.operation_content.tag);
    initialize_operation_content_tags();
    initialize_button_content_tags();

    html_element.page_tag.operation_form.global_tag.appendChild(html_element.page_tag.operation_form.buttons.tag);
}

function initialize_global_tag_var() {
    create_tag();
    initialize_tag();

    html_element.document_utils_function.add_new_tag_in_body(html_element.page_tag.button_start_turn)
}


window.addEventListener("DOMContentLoaded", initialize_global_tag_var);
