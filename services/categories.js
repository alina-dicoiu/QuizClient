var categories = (function () {

    function loadCategories() {
        $.ajax("https://localhost:44356/api/Categories/All", {
            method: "GET",
            dataType: "json"
        })
            .done(function (data, status, jqXHR) {
                for (let i = 0; i < data.length; i++) {
                    $("#categories-body").append(newCardForCategory(data[i]));
                }
            })
            .fail(function (jqXHR, status, error) {
                $("#categories-body").append(newErrorMessage());
            });
    }

    function newCardForCategory(category) {
        let description = "How much do you know about " + category.Name + "? Take this quiz to find out!";
        return `          
            <div class="col-md-4">
                <div class="card mb-4 shadow-sm">
                <div class="bg-secondary category-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="card-header">
                    <h1>${category.Name}</h1>
                </div>
                <div class="card-body">
                    <p class="card-text">${description}</p>
                    <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-secondary">Edit Quiz</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary">Take Quiz</button>
                    </div>
                </div>
                </div>
            </div>`;
    }

    function newErrorMessage(){
        return `
        <div class="alert alert-danger categories-error" role="alert">
            Could not load categories from server.
        </div>`;
    }

    return {
        load: loadCategories
    }
})();