const player = {{ player | safe }};
const game_id = {{  game.id }};

const page_tag = {
    player_position_tag: null,
    next_case_position: null
}

function initialize_global_tag() {
    page_tag.player_position_tag = document.querySelector(".player_position");
    page_tag.next_case_position = document.querySelector("ul.next_case_positions");
}

window.addEventListener("DOMContentLoaded", (event) => {
        initialize_global_tag();

    }
);