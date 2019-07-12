var editQuiz = (function() {
    function loadCategories(Id) {
        $.ajax("https://localhost:44356/api/Categories/ById/" + Id, {
            method: "GET",
            dataType: "json"
        })
            .done(function (data, status, jqXHR) {
                $("#categoryTitle").html(data.Name);
            })

        }

    return {
        loadCategory : loadCategories,
        loadQuestions : loadQuestions
    }

    function loadQuestions(Id) {
        $.ajax("https://localhost:44356/api/Questions/ByCategory/" + Id, {
            method: "GET",
            dataType: "json"
        })
            .done(function (data, status, jqXHR) {
                for (let i=0; i<data.length ; i++)
                $("#questionsContainer").append(newCardForQuestion(data[i]));
                debugger;
            })
            .fail(function (jqXHR, status, error) {
                $("#questionsContainer").append(newErrorMessage());
            });

        }

        function newErrorMessage(){
            return `
            <div class="alert alert-danger categories-error" role="alert">
                Could not load questions from server.
            </div>`;
        }

        function newCardForQuestion(Question){
        let Answers = "";
        for(let i=0; i<Question.PossibleAnswers.length; i++){
            Answers += newListItem(Question.PossibleAnswers[i]);
        }
        return`
            <div class="card">
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
                <button class="btn btn-danger delete-post-button" data-id=${Question.Id}>Delete</button>
            </div>
            </div>
            
            `;
        }

        function newListItem(Answer){
            let styleClass = "incorrect";
            if(Answer.Correct == true)
                styleClass = "correct";
            return `<li class="list-group-item ${styleClass}">${Answer.Text}</li>`
        }

})(); 

