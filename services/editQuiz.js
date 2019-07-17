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

    $(document).on("click", ".edit-question-button", function () {
        $("#edit-error-message").html("");
        let QuestionId = this.getAttribute("data-id");

        loadQuestion(QuestionId);

    });

    $(document).on("click", ".add-button", function () {
        $("#add-error-message").html("");
    });




    function loadCategories(Id) {
        $.ajax("https://localhost:44356/api/Categories/ById/" + Id, {
                method: "GET",
                dataType: "json"
            })
            .done(function (data, status, jqXHR) {
                $("#mainHeaderText").append(`<h2>${data.Name}<h2>`);
            })

    }

    return {
        loadCategory: loadCategories,
        loadQuestions: loadQuestions,
        saveQuestion: saveQuestion,
        PutQuestion: PutQuestion
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
                <button class="btn btn-primary edit-question-button" data-toggle="modal" data-target="#edit-question-modal" data-id=${Question.Id}>Edit</button>
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

    function loadQuestion(id) {

        $.ajax("https://localhost:44356/api/Questions/ById/" + id, {
                method: "GET",
                dataType: "json"
            })
            .done(function (data, status, jqXHR) {
                $("#question-text").val(data.Text);
                $("#edit-option1").val(data.PossibleAnswers[0].Text);
                $("#edit-option2").val(data.PossibleAnswers[1].Text);
                $("#edit-option3").val(data.PossibleAnswers[2].Text);
                $("#edit-option4").val(data.PossibleAnswers[3].Text);

                $("#edit-option1").attr("data-id", data.PossibleAnswers[0].Id);
                $("#edit-option1").attr("data-question-id", data.PossibleAnswers[0].QuestionId);
                $("#edit-answer1").prop("checked", data.PossibleAnswers[0].Correct);

                $("#edit-option2").attr("data-id", data.PossibleAnswers[1].Id);
                $("#edit-option2").attr("data-question-id", data.PossibleAnswers[1].QuestionId);
                $("#edit-answer2").prop("checked", data.PossibleAnswers[1].Correct);

                $("#edit-option3").attr("data-id", data.PossibleAnswers[2].Id);
                $("#edit-option3").attr("data-question-id", data.PossibleAnswers[2].QuestionId);
                $("#edit-answer3").prop("checked", data.PossibleAnswers[2].Correct);

                $("#edit-option4").attr("data-id", data.PossibleAnswers[3].Id);
                $("#edit-option4").attr("data-question-id", data.PossibleAnswers[3].QuestionId);
                $("#edit-answer4").prop("checked", data.PossibleAnswers[3].Correct);
            })

    }

    function PutQuestion(id, put) {
        $.ajax("https://localhost:44356/api/Questions/Update/" + id, {
                method: "PUT",
                dataType: "json",
                data: put
            })
            .done(function (data, status, jqXHR) {
                $("#questionsContainer").html("");
                let searchParams = new URLSearchParams(window.location.search)
                let categoryId = searchParams.get('id');
                loadQuestions(categoryId);
                $("#edit-question-modal").modal("toggle");
            })
            .fail(function (jqXHR, status, error) {

            })

    };

})();