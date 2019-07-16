var editQuiz = (function () {
    function loadCategories(Id) {
        $.ajax("https://localhost:44356/api/Categories/ById/" + Id, {
            method: "GET",
            dataType: "json"
        })
        .done(function (data, status, jqXHR) {
            $("#mainHeaderText").append(`<h2 align="center">${data.Name}</h2>`);
        })
        .fail(function (jqXHR, status, error) {
            $("#questions-body").append(newErrorMessage());
        });
    }
    $(document).on("click", ".delete-post-button", function () {

        let questionID = this.getAttribute("data-id");

        $("#delete-question-button").off("click").on("click", function () {
            deleteQuestion(questionID);
        })
    });

    return {
        loadCategory: loadCategories,
        loadQuestions: loadQuestions,
        saveQuestion: saveQuestion
    }

    function saveQuestion(data){
        return $.ajax("https://localhost:44356/api/Questions/Add", {
            method: "POST",
            dataType: "json",
            data: data
        })
            .done(function (data, status, jqXHR) {
                $("#questionsContainer").append(newCardForQuestion(data));
                $("#add-question-modal").modal('toggle');
            })
            .fail(function (jqXHR, status, error) {
                console.log(error);
            })
    }

    function deleteQuestion(id) {
        return $.ajax("https://localhost:44356/api/Questions/Delete/" + id, {
            method: "DELETE",
            dataType: "json"
        })
            .done(function (data, status, jqXHR) {
                $(".card[data-id=" + id + "]").remove();
                $("#delete-question-modal").modal('toggle');
            })
            .fail(function (jqXHR, status, error) {
                console.log(error);
            })
    }

    function loadQuestions(Id) {
        $.ajax("https://localhost:44356/api/Questions/ByCategory/" + Id, {
            method: "GET",
            dataType: "json"
        })
            .done(function (data, status, jqXHR) {
                for (let i = 0; i < data.length; i++)
                    $("#questionsContainer").append(newCardForQuestion(data[i]));
                debugger;
            })
            .fail(function (jqXHR, status, error) {
                $("#questionsContainer").append(newErrorMessage());
            });
    }

    function newErrorMessage() {
        return `
        <div class="alert alert-danger categories-error" role="alert">
            Could not load questions from server.
        </div>`;
    }

    function newCardForQuestion(Question) {
        let Answers = "";
        for (let i = 0; i < Question.PossibleAnswers.length; i++) {
            Answers += newListItem(Question.PossibleAnswers[i]);
        }
        return `
        <div class="card"  data-id=${Question.Id}>
            <div class="card-header">
                ${Question.Text}
            </div>
            <div class="card-body">
                <ul class="list-group list-group-flush">
                    ${Answers}
                </ul>
            </div>
            <div class="card-footer">
                <button class="btn btn-primary edit-post-button" data-toggle="modal" data-target="#edit-post-modal" data-id=${Question.Id}>Edit</button>
                <button class="btn btn-danger delete-post-button" data-toggle="modal" data-target="#delete-question-modal" data-id=${Question.Id}>Delete</button>
            </div>
        </div>`;
    }
    function newListItem(Answer) {
        let styleClass = "incorrect";
        if (Answer.Correct == true)
            styleClass = "correct";
        return `<li class="list-group-item ${styleClass}">${Answer.Text}</li>`
    }
})();