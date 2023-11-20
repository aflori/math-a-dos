// let is_game_running = true;
const html_element = {
        page_tag: {
            player_position_tag: null,
            next_case_position: null,
            button_start_turn: document.createElement("button"),
            button_throw_dice: document.createElement("button"),
            amount_movement_by_movement_dice: document.createElement("p"),
            mandatory_operation: document.createElement("p"),
            operation_form: {
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
        },
        init: function () {

            function initialize_existing_tag() {
                this.page_tag.player_position_tag = document.querySelector(".player_position");
                this.page_tag.next_case_position = document.querySelector("ul.next_case_positions");
            }

            function initialize_tag_content() {
                this.page_tag.button_start_turn.textContent = "Se déplacer";
                this.page_tag.button_throw_dice.textContent = "lancer les dés";

                this.page_tag.operation_form.operation_content.element_tag.text.textContent = "opération:";
                this.page_tag.operation_form.buttons.buttons_tag.submit.textContent = "le compte est bon!";
                this.page_tag.operation_form.buttons.buttons_tag.confirm_operation.textContent = "Confirmer l'opérations";
                this.page_tag.operation_form.buttons.buttons_tag.reset_1.textContent = "annuler un mouvement";
                this.page_tag.operation_form.buttons.buttons_tag.reset_all.textContent = "annuler tous les mouvements";

            }

            function initialize_event_listener() {
                this.page_tag.button_start_turn.addEventListener("click", this.event_listener_functions.move_action);
                this.page_tag.button_throw_dice.addEventListener("click", this.event_listener_functions.send_throw_dice_request);

                this.page_tag.operation_form.operation_content.element_tag.number_1.addEventListener("click", this.event_listener_functions.remove_number_in_operation);
                this.page_tag.operation_form.operation_content.element_tag.number_2.addEventListener("click", this.event_listener_functions.remove_number_in_operation);
                this.page_tag.operation_form.buttons.buttons_tag.submit.addEventListener("click", this.event_listener_functions.submit_full_operation);
                this.page_tag.operation_form.buttons.buttons_tag.confirm_operation.addEventListener("click", this.event_listener_functions.confirm_single_operation);
                this.page_tag.operation_form.buttons.buttons_tag.reset_1.addEventListener("click", this.event_listener_functions.return_one_operation_back);
                this.page_tag.operation_form.buttons.buttons_tag.reset_all.addEventListener("click", this.event_listener_functions.remove_all_operation);

            }

            function initialize_tag_in_parent_tag() {
                this.page_tag.operation_form.global_tag.appendChild(this.page_tag.operation_form.available_number_tags.tag);
                this.page_tag.operation_form.global_tag.appendChild(this.page_tag.operation_form.operation_content.tag);
                this.page_tag.operation_form.global_tag.appendChild(this.page_tag.operation_form.buttons.tag);
                this.page_tag.operation_form.buttons.tag.appendChild(this.page_tag.operation_form.buttons.buttons_tag.submit);
                this.page_tag.operation_form.buttons.tag.appendChild(this.page_tag.operation_form.buttons.buttons_tag.confirm_operation);
                this.page_tag.operation_form.buttons.tag.appendChild(this.page_tag.operation_form.buttons.buttons_tag.reset_1);
                this.page_tag.operation_form.buttons.tag.appendChild(this.page_tag.operation_form.buttons.buttons_tag.reset_all);
                this.page_tag.operation_form.operation_content.tag.appendChild(this.page_tag.operation_form.operation_content.element_tag.text);
                this.page_tag.operation_form.operation_content.tag.appendChild(this.page_tag.operation_form.operation_content.element_tag.number_1);
                this.page_tag.operation_form.operation_content.tag.appendChild(this.page_tag.operation_form.operation_content.element_tag.operator);
                this.page_tag.operation_form.operation_content.tag.appendChild(this.page_tag.operation_form.operation_content.element_tag.number_2);
            }

            function initialize_form_content() {
                function add_option_to_select_tag(select_tag, value, text_shown) {
                    let option_select = document.createElement("option");
                    option_select.value = value;
                    option_select.textContent = text_shown;
                    select_tag.appendChild(option_select);
                }

                this.page_tag.operation_form.operation_content.element_tag.number_1.type = "button";
                this.page_tag.operation_form.operation_content.element_tag.number_2.type = "button";

                this.page_tag.operation_form.buttons.buttons_tag.submit.type = "submit";
                this.page_tag.operation_form.buttons.buttons_tag.confirm_operation.type = "submit";
                this.page_tag.operation_form.buttons.buttons_tag.reset_1.type = "reset";
                this.page_tag.operation_form.buttons.buttons_tag.reset_all.type = "reset";



                add_option_to_select_tag(this.page_tag.operation_form.operation_content.element_tag.operator, "add", "+");
                add_option_to_select_tag(this.page_tag.operation_form.operation_content.element_tag.operator, "sub", "-");
                add_option_to_select_tag(this.page_tag.operation_form.operation_content.element_tag.operator, "mul", "*");
                add_option_to_select_tag(this.page_tag.operation_form.operation_content.element_tag.operator, "div", "/");

            }


            initialize_existing_tag();
            initialize_tag_content();
            initialize_event_listener();
            initialize_tag_in_parent_tag();
            initialize_form_content();
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
                            const numberCaseMoving = game_data.number_case_moved;

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

            confirm_single_operation: function (event) {
                event.preventDefault();

                const operation = html_element.document_utils_function.extract_operation_data_from_page();

                game_data.add_operation_in_local(operation);

                html_element.document_utils_function.update_document_tag_after_operation_done(operation);

                html_element.document_utils_function.empty_operation_field();
            },
            return_one_operation_back: function (event) {
                event.preventDefault();
                if (game_data.operations_list.length === 0) {
                    return;
                }
                const operation_removed = game_data.operations_list.pop();

                html_element.document_utils_function.move_all_used_number_to_available();

                html_element.document_utils_function.remove_one_available_number(operation_removed.result);
                html_element.document_utils_function.create_new_available_number_tag(operation_removed.number_1);
                html_element.document_utils_function.create_new_available_number_tag(operation_removed.number_2);
            },
            remove_all_operation: function (event) {
                event.preventDefault();

                const fake_event = {
                    preventDefault: function () {
                    }
                };

                while (game_data.util.has_made_local_operation()) {
                    html_element.event_listener_functions.return_one_operation_back(fake_event);
                }
            },

            submit_full_operation: function (event) {
                event.preventDefault();

                const operations = game_data.operations_list;

                const request_content = html_element.document_utils_function.create_JSON_request_content(operations)

                fetch("{% url 'math:confirm_full_operation' player_id %}", request_content).then(
                    raw_data => {
                        return raw_data.json();
                    }).then(
                    json => {
                        console.log(json);
                    }
                );
            }
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

            update_tag_text_content: function (tag, textContent) {
                tag.textContent = textContent
            },

            remove_button_throw_dice: function () {
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
            set_objective_on_operation_tag: function () {
                const available_number_tag = html_element.page_tag.operation_form.available_number_tags.tag;
                const objective = game_data.awaited_result_for_operation;

                this.clean_tag_content(available_number_tag);
                available_number_tag.textContent = "il faut faire " + objective + " avec: ";
            },
            set_available_number_from_game_data: function () {
                const available_numbers = game_data.available_numbers_for_operation;

                available_numbers.forEach(
                    number => {
                        this.create_new_available_number_tag(number);
                    }
                );
            },
            empty_operation_field: function () {
                const tags = html_element.page_tag.operation_form.operation_content;
                const operation_number_1 = tags.element_tag.number_1;
                const operation_number_2 = tags.element_tag.number_2;

                operation_number_1.textContent = "";
                operation_number_2.textContent = "";
            },

            move_available_number_to_used_number_empty_tag: function (tag_to_move) {
                const operation_container = html_element.page_tag.operation_form.operation_content.element_tag;

                if (operation_container.number_1.textContent === "") {
                    this.move_available_number_to_used_number(operation_container.number_1, tag_to_move);
                } else if (operation_container.number_2.textContent === "") {
                    this.move_available_number_to_used_number(operation_container.number_2, tag_to_move);
                }
            },
            move_available_number_to_used_number: function (target_tag, origin_tag) {
                const tag_content = origin_tag.textContent;

                this.update_tag_text_content(target_tag, tag_content);
                this.remove_from_available_number_in_operation(origin_tag);
            },
            remove_from_available_number_in_operation: function (tag_to_remove) {
                const page_tag_buttons_tag = html_element.page_tag.operation_form.available_number_tags.numbers_tag;

                const index = page_tag_buttons_tag.indexOf(tag_to_remove);

                this.remove_available_number_tag_from_index(index);
            },
            remove_available_number_tag_from_index: function (index) {
                const page_tag_buttons_tag = html_element.page_tag.operation_form.available_number_tags.numbers_tag;
                if (index > -1) {
                    const tag_to_remove = page_tag_buttons_tag[index];
                    page_tag_buttons_tag.splice(index, 1);
                    tag_to_remove.remove();
                }

            },

            create_new_available_number_tag: function (number) {
                const new_tag = document.createElement("button");
                new_tag.textContent = number.toString();
                new_tag.type = "button";

                html_element.page_tag.operation_form.available_number_tags.numbers_tag.push(new_tag);
                html_element.page_tag.operation_form.available_number_tags.tag.appendChild(new_tag);
                new_tag.addEventListener("click", html_element.event_listener_functions.use_number_in_operation);
            },
            move_used_number_to_available_number: function (used_tag) {
                if (used_tag.textContent === "") {
                    return;
                }

                this.create_new_available_number_tag(used_tag.textContent);

                used_tag.textContent = "";
            },

            extract_operation_data_from_page: function () {
                const operation_tag = this.extract_available_operation_tag()
                if (operation_tag === undefined) {
                    return undefined;
                }

                const operation = this.initialize_local_operation_with_default_values(operation_tag);
                this.update_operation_result_from_number_contained_in_tag(operation);
                this.update_available_number_after_operation(operation);
                return operation;
            },
            extract_available_operation_tag: function () {
                const operation_tag = html_element.page_tag.operation_form.operation_content.element_tag;

                if (operation_tag.number_1.textContent === "" || operation_tag.number_2.textContent === "") {
                    return undefined;
                }
                return operation_tag;
            },
            update_available_number_after_operation: function (operation) {
                const available_number_tag = html_element.page_tag.operation_form.available_number_tags.numbers_tag;

                available_number_tag.forEach((available_number_tag) => {
                    const number = Number(available_number_tag.textContent);
                    operation.available_number_after_operation.push(number);
                });
                operation.available_number_after_operation.push(operation.result);
            },
            update_operation_result_from_number_contained_in_tag: function (operation) {
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
            },
            initialize_local_operation_with_default_values: function (operation_tag) {
                return {
                    operation_done: operation_tag.operator.value,
                    number_1: Number(operation_tag.number_1.textContent),
                    number_2: Number(operation_tag.number_2.textContent),
                    result: null,
                    available_number_after_operation: []
                };
            },

            update_document_tag_after_operation_done: function (operation) {
                const number = operation.result;
                html_element.document_utils_function.create_new_available_number_tag(number);
            },


            remove_one_available_number: function (number_to_remove) {
                number_to_remove = number_to_remove.toString();
                const list_available_numbers = html_element.page_tag.operation_form.available_number_tags.numbers_tag;
                let i = 0;

                while (i < list_available_numbers.length) {
                    const tag_tested = list_available_numbers[i];
                    const tag_removed = this.remove_tag_if_number_is_equals(tag_tested, number_to_remove);
                    if (this.is_valid_tag(tag_removed)) {
                        return;
                    }
                    i++;
                }
            },
            remove_tag_if_number_is_equals: function (tag, number) {
                if (tag.textContent === number) {
                    this.remove_from_available_number_in_operation(tag);
                    return tag;
                }
                return null;
            },
            is_valid_tag: function (tag_removed) {
                return tag_removed !== null;
            },
            move_all_used_number_to_available: function () {
                const operation_details = html_element.page_tag.operation_form.operation_content.element_tag;
                html_element.document_utils_function.move_used_number_to_available_number(operation_details.number_1);
                html_element.document_utils_function.move_used_number_to_available_number(operation_details.number_2);
            },

            create_JSON_request_content: function (body) {
                return {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json"
                    }
                };
            }

        }
    }
;

const game_data = {
    _game: undefined, //updated after the first request
    operations_list: [],


    get game() {
        return this._game;
    },
    set game(game_data) {
        this._game = game_data;
    },

    get number_case_moved() {
        return this._game.moving_dice.last_number_throw;
    },
    get available_numbers_for_operation() {

        const available_numbers = [];
        const number_dices = this._game.dices;

        number_dices.forEach(
            dice => {
                available_numbers.push(dice.last_number_throw)
            }
        );
        return available_numbers;
    },
    get awaited_result_for_operation() {
        return game_data._game.result_dice.last_number_throw;
    },

    add_operation_in_local: function (operation) {
        this.operations_list.push(operation);
    },
    util: {
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
        },
        has_made_local_operation: function () {
            return game_data.operations_list.length !== 0;
        }
    },
    player_id: {{ player_id }};
};


function initialize_global_tag_var() {
    html_element.init();

    html_element.document_utils_function.add_new_tag_in_body(html_element.page_tag.button_start_turn)
}


window.addEventListener("DOMContentLoaded", initialize_global_tag_var);
