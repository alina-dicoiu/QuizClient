$(document).ready(function () {

    $("#save-category-button").click(function () {
        $("#add-category-alert").html("");
        let title = $("#category-title").val();
        let id = $("#category-id").val();

        if (title == "") {
            let error = `
            <div class="alert alert-danger " role="alert">
                You did not fill in the field!
            </div>`;
            $("#add-category-alert").append(error);
        } else {
            let post = {
                Name: title,
                Id: id
            }

            $("#category-title").val("");
            $("#category-id").val("");
            categories.save(post);
        }
    })
    $("#cancel-add-category-button").click(function () {
        $("#add-category-alert").html("");
        $("#category-title").val("");
    })

    $(document).on("click", "#help", function () {
        let categoryID = this.getAttribute("data-id");
        $("#delete-category-button").off("click").on("click", function () {
            categories.delete(categoryID);
        })
    });
});

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
        <div class="col-md-4" data-id=${category.Id}>
            <div class="card mb-4 shadow-sm">
                <div class="bg-secondary category-header">
                    <button type="button" class="close" id="help" data-id=${category.Id} data-toggle="modal" data-target="#delete-category-modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-header">
                    <h2>${category.Name}</h2>
                </div>
                <div class="card-body">
                    <p class="card-text">${description}</p>
                    <div class="btn-group">
                        <a href=./edit-quiz.html?id=${category.Id}> <button type="button" class="btn btn-sm btn-outline-secondary">Edit Quiz</button></a>
                        <a href=./take-quiz.html?id=${category.Id}><button type="button" class="btn btn-sm btn-outline-secondary">Take Quiz</button></a>
                    </div>
                </div>
            </div>
        </div>`;
    }

    function newErrorMessage() {
        return `
        <div class="alert alert-danger categories-error" role="alert">
            Could not load categories from server.
        </div>`;
    }

    function saveCategory(data) {
        return $.ajax("https://localhost:44356/api/Categories/Add", {
                method: "POST",
                dataType: "json",
                data: data
            })
            .done(function (data, status, jqXHR) {
                $("#categories-body").append(newCardForCategory(data));
                $("#add-category-modal").modal('toggle');
            })
            .fail(function (jqXHR, status, error) {
                console.log(error);
            })
    }

    function deleteCategory(id) {

        return $.ajax("https://localhost:44356/api/Categories/Delete/" + id, {
                method: "DELETE",
                dataType: "json"
            })
            .done(function (data, status, jqXHR) {
                $(".col-md-4[data-id=" + id + "]").remove();
                $("#delete-category-modal").modal('toggle');
            })

            .fail(function (jqXHR, status, error) {
                console.log(error);
            })
    }

    return {
        load: loadCategories,
        save: saveCategory,
        delete: deleteCategory
    }
})();