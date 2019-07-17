var correctAnswers;

$(document).ready(function () {
    let searchParams = new URLSearchParams(window.location.search)
    let categoryId = searchParams.get('id');
    loadQuestions(categoryId);
    $("#submit-button").on("click", function () {
        checkAnswers();
    })
});

function checkAnswers() {
    let score = 0;
    let answer, selectedAnswer;
    for(let i = 0; i < correctAnswers.length; i++) {
        answer = $("input[data-question-id=" + correctAnswers[i].Id + "]:checked");
        selectedAnswer = $(answer).attr("data-id");
        for(let j = 0; j < correctAnswers[i].PossibleAnswers.length; j++) {
            if(correctAnswers[i].PossibleAnswers[j].Correct == true && selectedAnswer == correctAnswers[i].PossibleAnswers[j].Id) {
                score++;
                break;
            }
        }
    }
    $("#scoreDialog").modal('toggle');
    $("#scoreText").html("");
    $("#scoreText").append(`<h2>You scored ${score} / ${correctAnswers.length}!<h2>`);
    if(score < correctAnswers.length) {
        $("#scoreText").append(`<h2>Close this dialog to see the correct answers.<h2>`);
        $(`input[type="radio"]:checked`).each(function(index, element){
            let answerID = element.getAttribute("data-id");
            $("li[data-id=" + answerID + "]").addClass("wrong");
        });
        for(let i = 0; i < correctAnswers.length; i++) {
            for(let j = 0; j < correctAnswers[i].PossibleAnswers.length; j++) {
                if(correctAnswers[i].PossibleAnswers[j].Correct == true) {
                    $("li[data-id=" + correctAnswers[i].PossibleAnswers[j].Id + "]").removeClass("wrong");
                    $("li[data-id=" + correctAnswers[i].PossibleAnswers[j].Id + "]").addClass("right");
                    break;
                }
            }
        }
    }
}

function loadQuestions(id) {
    $.ajax("https://localhost:44356//api/Questions/ByCategory/" + id, {
        method: "GET",
        dataType: "json"
    })
        .done(function (data, status, jqXHR) {
            createHeader(id);
            correctAnswers = data;
            for (let i = 0; i < data.length; i++) {
                $("#questions-body").append(newCardForQuestion(data[i]));
            }
        })
        .fail(function (jqXHR, status, error) {
            $("#questions-body").append(newErrorMessage());
        });
}

function createHeader(id) {
    $.ajax("https://localhost:44356//api/Categories/ById/" + id, {
        method: "GET",
        dataType: "json"
    })
        .done(function (data, status, jqXHR) {
            $("#mainHeaderText").append(`<h2 align="center">${data.Name}</h2>`);
        })
}

function newListItem(answer, answerName) {
    return `
    <li class="list-group-item" data-id="${answer.Id}">
        <div class="input-group">
            <div class="input-group-prepend">
                <div class="input-group-text">
                    <input type="radio" data-id="${answer.Id}" data-question-id="${answer.QuestionId}" name="${answer.QuestionId}" aria-label=${answerName}>${answerName}
                </div>
            </div>
            <input type="text" class="form-control" value="${answer.Text}" readonly/>
        </div>
    </li>`;
}

function newCardForQuestion(question) {
    let questionText = question.Text;
    let answers = "";
    let answerName = 'A';
    for (let i = 0; i < question.PossibleAnswers.length; i++) {
        answers += newListItem(question.PossibleAnswers[i], answerName);
        answerName = String.fromCharCode(answerName.charCodeAt(0) + 1);
        answers += " ";
    }
    return `
    <div class="card" data-id="${question.Id}">
        <div class="card-header">
            ${questionText}
        </div>
        <ul class="list-group list-group-flush">
            ${answers}
        </ul>
    </div>`;
}

function newErrorMessage() {
    return `
    <div class="alert alert-danger categories-error" role="alert">
        Failed to load questions from server for this category.
    </div>`;
}