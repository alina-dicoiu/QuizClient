$(document).ready(function(){
    let searchParams = new URLSearchParams(window.location.search)
    let categoryId = searchParams.get('id');
    loadQuestions(categoryId);
});

function loadQuestions(id){
    $.ajax("https://localhost:44356//api/Questions/ByCategory/" + id, {
            method: "GET",
            dataType: "json"
        })
            .done(function (data, status, jqXHR) {
                $("#questions-body").append(createHeader(id));
                for (let i = 0; i < data.length; i++) {
                    $("#questions-body").append(newCardForQuestion(data[i]));
                }

            })
            .fail(function (jqXHR, status, error) {
                $("#questions-body").append(newErrorMessage());
            });
}

function createHeader(id){
    $.ajax("https://localhost:44356//api/Categories/ById/" + id, {
            method: "GET",
            dataType: "json"
        })
            .done(function (data, status, jqXHR) {
                return `<h2>${data.Name}</h2>`

            })
            .fail(function (jqXHR, status, error) {
                $("#questions-body").append(newErrorMessage());
            });
}

function newListItem(answer, answerName){
    return `<li class="list-group-item">
    <div class="input-group">
  <div class="input-group-prepend">
    <div class="input-group-text">
      <input type="radio" name="${answer.QuestionId}" aria-label=${answerName}>${answerName}
    </div>
  </div>
  <input type="text" class="form-control" value=${answer.Text} readonly/>
</div>

    </li>`
}

function newCardForQuestion(question){
    let questionText = question.Text;
    let answers = "";
    let answerName = 'A';
    for(let i = 0; i < question.PossibleAnswers.length; i++){
        answers += newListItem(question.PossibleAnswers[i], answerName);
        answerName = String.fromCharCode(answerName.charCodeAt(0) + 1);
        answers += " ";
        console.log(answers[i] + '\n');
    }
    return `
    <div class="card" style="width: 20rem; margin-left: 5px">
        <div class="card-header">
            ${questionText}
        </div>
    <ul class="list-group list-group-flush">
        ${answers}
    </ul>
    </div>`;
}

function newErrorMessage(){
    return `
    <div class="alert alert-danger categories-error" role="alert">
        Failed to load questions from server for this category.
    </div>`;
}