const server = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", function () {
    function loadCollection() {
        const userId = sessionStorage.getItem("userId");
        const token = sessionStorage.getItem("token");
        fetch(server + "/getcollection", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Login failed");
                }
            })
            .then((data) => {
                populateCollection(data);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    function deleteCollection(collectionId) {
        const token = sessionStorage.getItem("token");
        fetch(server + "/deletecollection", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ _id: collectionId }),
        })
            .then((response) => {
                if (response.ok) {
                    loadCollection();
                    return response.json();
                } else {
                    throw new Error("Erro ao deletar coleção");
                }
            })
            .catch((error) => {
                //console.log(error.message);
            });
    }

    function deleteItem(itemId) {
        const token = sessionStorage.getItem("token");
        fetch(server + "/deleteitem", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ _id: itemId }),
        })
            .then((response) => {
                if (response.ok) {
                    loadItem();
                    return response.json();
                } else {
                    throw new Error("Erro ao deletar item");
                }
            })
            .catch((error) => {
                //console.log(error.message);
            });
    }

    const collectionContainer = document.getElementById("collection-container");
    if (collectionContainer) {
        loadCollection();
    }

    const itemContainer = document.getElementById("item-container");
    if (itemContainer) {
        loadItem();
    }

    const collectionTitle = document.getElementById("collectionTitle");
    if  (collectionTitle) {
        const params = new URLSearchParams(window.location.search);
        const urlCollectionId = params.get("id");
        const token = sessionStorage.getItem("token");
        fetch(server + "/getcollectionname?id="+urlCollectionId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Erro nome da coleção");
                }
            })
            .then((data) => {
                collectionTitle.innerHTML = data.name;
            })
            .catch((error) => {
                console.log(error.message);
            });
        
    }

    function loadItem() {
        const params = new URLSearchParams(window.location.search);
        const urlCollectionId = params.get("id");
        const token = sessionStorage.getItem("token");
        fetch(server + "/getitems", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ urlCollectionId }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Login failed");
                }
            })
            .then((data) => {
                populateItem(data);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    function populateItem(data) {
        itemContainer.innerHTML = "";
        data.forEach((item) => {
            if (!item) {
                return;
            }
            const itemCard = document.createElement("div");
            itemCard.className = "item";

            itemCard.innerHTML = `<img src="file:///${item.image}" alt="" class="item-image">
            <div class="item-name">${item.name}</div>
            <div class="item-description" style="display: none;">${item.description}</div>
            <div class="item-id" style="display: none;">${item._id}</div>`;

            itemCard.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                const image = e.currentTarget.childNodes[0].src;
                const name = e.currentTarget.childNodes[2].innerHTML;
                const description = e.currentTarget.childNodes[4].innerHTML;
                const itemId = e.currentTarget.childNodes[6].innerHTML;
                toggleItemShow(name, image, description, itemId);
            });
            itemContainer.appendChild(itemCard);
        });
    }

    function populateCollection(data) {
        collectionContainer.innerHTML = "";
        data.forEach((collection) => {
            if (!collection) {
                return;
            }

            const collectionCard = document.createElement("div");
            collectionCard.className = "collection";

            collectionCard.addEventListener("click", (e) => {
                window.location.href = "./collection.html?id=" + collection._id;
            });

            const collectionController = document.createElement("div");
            collectionController.className = "collection-controller";

            const editCard = document.createElement("img");
            editCard.src = "./icons/edit.svg";
            editCard.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                const thisCard =
                    e.currentTarget.parentNode.parentNode.childNodes;
                const name = thisCard[3].innerHTML;
                const description = thisCard[5].innerHTML;
                toggleCollectionEditForm(name, description, collection._id);
            });

            const deleteCard = document.createElement("img");
            deleteCard.src = "./icons/trash.svg";
            deleteCard.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteCollection(collection._id);
            });

            collectionController.appendChild(editCard);
            collectionController.appendChild(deleteCard);

            collectionCard.innerHTML = `
            <img class='collection-img' src="file:///${collection.image}" alt="Not Found (404)"/>
            <div class="collection-name">${collection.name}</div>
            <div class="collection-description">${collection.description}</div>`;

            collectionCard.appendChild(collectionController);

            collectionContainer.appendChild(collectionCard);
        });
    }

    // Funções de Login
    function login() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        fetch(server + "/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Login failed");
                }
            })
            .then((data) => {
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("userId", data.userId);
                window.location.href = "dashboard.html"; // Alterar para a URL da dashboard
            })
            .catch((error) => {
                const messageDiv = document.getElementById("message");
                messageDiv.style.color = "red";
                messageDiv.innerText = "Login failed: " + error.message;
            });
    }

    // Funções de Registro
    function register() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        fetch(server + "/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error(response.statusText);
                }
            })
            .then((data) => {
                const messageDiv = document.getElementById("message");
                messageDiv.style.color = "green";
                messageDiv.innerText =
                    "Registrado com sucesso! Redirecionando para o Login...";
                setTimeout(() => {
                    window.location.href = "login.html"; // Redirecionar para a página de login
                }, 2000);
            })
            .catch((error) => {
                const messageDiv = document.getElementById("message");
                messageDiv.style.color = "red";
                messageDiv.innerText = "Erro ao registrar: " + error.message;
            });
    }

    function createCollection() {
        const name = document.getElementById("collectionName").value;
        const description = document.getElementById(
            "collectionDescription"
        ).value;
        const image = document.getElementById("collectionImage").value;
        const userId = sessionStorage.getItem("userId");
        const token = sessionStorage.getItem("token");

        fetch(server + "/createcollection", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name, description, image, userId }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error(response.statusText);
                }
            })
            .then((data) => {
                toggleCollectionForm();
                loadCollection();
            })
            .catch((error) => {
                const messageDiv = document.getElementById("message");
                messageDiv.style.color = "red";
                messageDiv.innerText = "Erro ao criar: " + error.message;
            });
    }

    function createItem() {
        const name = document.getElementById("itemName").value;
        const description = document.getElementById("itemDescription").value;
        const image = document.getElementById("itemImage").value;
        const params = new URLSearchParams(window.location.search);
        const urlCollectionId = params.get("id");
        const token = sessionStorage.getItem("token");

        fetch(server + "/createitem", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name, description, image, urlCollectionId }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error(response.statusText);
                }
            })
            .then((data) => {
                toggleItemForm();
                loadItem();
            })
            .catch((error) => {
                const messageDiv = document.getElementById("message");
                messageDiv.style.color = "red";
                messageDiv.innerText = "Erro ao criar: " + error.message;
                console.log(error.message);
            });
    }

    function editCollection() {
        const name = document.getElementById("collectionEditName").value;
        const description = document.getElementById(
            "collectionEditDescription"
        ).value;
        const image = document.getElementById("collectionEditImage").value
            ? document.getElementById("collectionEditImage").value
            : false;

        const token = sessionStorage.getItem("token");

        fetch(server + "/updatecollection", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
                description,
                image,
                _id: collectionId,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error(response.statusText);
                }
            })
            .then((data) => {
                toggleCollectionEditForm();
                loadCollection();
            })
            .catch((error) => {
                const messageDiv = document.getElementById("editmessage");
                messageDiv.style.color = "red";
                messageDiv.innerText =
                    "Erro ao editar, nada foi alterado ou coleção não encontrada";
            });
    }
    function editItem() {
        const name = document.getElementById("itemEditName").value;
        const description = document.getElementById(
            "itemEditDescription"
        ).value;
        const image = document.getElementById("itemEditImage").value
            ? document.getElementById("itemEditImage").value
            : false;

        const token = sessionStorage.getItem("token");

        fetch(server + "/updateitem", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
                description,
                image,
                _id: itemId,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error(response.statusText);
                }
            })
            .then((data) => {
                toggleItemEditForm();
                loadItem();
            })
            .catch((error) => {
                const messageDiv = document.getElementById("editmessage");
                messageDiv.style.color = "red";
                messageDiv.innerText =
                    "Erro ao editar, nada foi alterado ou coleção não encontrada";
            });
    }

    function toggleCollectionForm() {
        const collectionForm = document.getElementById("collection-form");
        if (collectionForm.style.display === "none") {
            collectionForm.style.display = "inherit";
            collectionForm.style.animation = "splash 0.5s ease-in-out forwards";
            setTimeout(() => {
                collectionForm.style.animation = "inherit";
            }, 500);
            return;
        }
        collectionForm.style.animation =
            "splash 0.5s ease-in-out forwards reverse";
        setTimeout(() => {
            collectionForm.style.display = "none";
            collectionForm.style.animation = "inherit";
            document.getElementById("collectionName").value = "";
            document.getElementById("collectionDescription").value = "";
            document.getElementById("collectionImage").value = "";
            document.getElementById("message").innerHTML = "";
        }, 500);
    }

    function toggleItemForm() {
        const itemForm = document.getElementById("item-form");
        if (itemForm.style.display === "none") {
            itemForm.style.display = "inherit";
            itemForm.style.animation = "splash 0.5s ease-in-out forwards";
            setTimeout(() => {
                itemForm.style.animation = "inherit";
            }, 500);
            return;
        }
        itemForm.style.animation = "splash 0.5s ease-in-out forwards reverse";
        setTimeout(() => {
            itemForm.style.display = "none";
            itemForm.style.animation = "inherit";
            document.getElementById("itemName").value = "";
            document.getElementById("itemDescription").value = "";
            document.getElementById("itemImage").value = "";
            document.getElementById("message").innerHTML = "";
        }, 500);
    }

    var collectionId = undefined;
    function toggleCollectionEditForm(name, description, cId) {
        const collectionEditForm = document.getElementById(
            "collection-edit-form"
        );
        if (collectionEditForm.style.display === "none") {
            collectionId = cId;
            document.getElementById("collectionEditName").value = name;
            document.getElementById("collectionEditDescription").value =
                description;

            collectionEditForm.style.display = "inherit";
            collectionEditForm.style.animation =
                "splash 0.5s ease-in-out forwards";
            setTimeout(() => {
                collectionEditForm.style.animation = "inherit";
            }, 500);
            return;
        }
        collectionEditForm.style.animation =
            "splash 0.5s ease-in-out forwards reverse";
        setTimeout(() => {
            collectionEditForm.style.display = "none";
            collectionEditForm.style.animation = "inherit";
            collectionId = undefined;
            document.getElementById("collectionEditName").value = "";
            document.getElementById("collectionEditDescription").value = "";
            document.getElementById("editmessage").innerHTML = "";
        }, 500);
    }

    var itemId = undefined;
    function toggleItemEditForm(name, description, iId) {
        const itemEditForm = document.getElementById("item-edit-form");
        if (itemEditForm.style.display === "none") {
            itemId = iId;
            document.getElementById("itemEditName").value = name;
            document.getElementById("itemEditDescription").value = description;

            itemEditForm.style.display = "inherit";
            itemEditForm.style.animation = "splash 0.5s ease-in-out forwards";
            setTimeout(() => {
                itemEditForm.style.animation = "inherit";
            }, 500);
            return;
        }
        itemEditForm.style.animation =
            "splash 0.5s ease-in-out forwards reverse";
        setTimeout(() => {
            itemEditForm.style.display = "none";
            itemEditForm.style.animation = "inherit";
            itemId = undefined;
            document.getElementById("itemEditName").value = "";
            document.getElementById("itemEditDescription").value = "";
            document.getElementById("editmessage").innerHTML = "";
        }, 500);
    }

    function toggleItemShow(name, image, description, itemId) {
        const show = document.getElementById("item-show");
        const itemShowContainer = document.getElementById(
            "item-show-container"
        );
        if (show.style.display === "none") {
            document.getElementById("item-name-show").innerHTML = name;
            document.getElementById("item-image-show").src = image;
            document.getElementById("item-imageblur-show").src = image;
            document.getElementById("item-description-show").innerHTML =
                description;
            document.getElementById("item-id-show").innerHTML = itemId;
            show.style.display = "inherit";
            itemShowContainer.style.display = "inherit";
            show.style.animation = "showbg 0.2s ease-in-out forwards";
            itemShowContainer.style.animation =
                "splash 0.2s ease-in-out forwards";

            setTimeout(() => {
                show.style.animation = "inherit";
                itemShowContainer.style.animation = "inherit";
            }, 500);
            return;
        }
        show.style.animation = "showbg 0.2s ease-in-out forwards reverse";
        itemShowContainer.style.animation =
            "splash 0.2s ease-in-out forwards reverse";
        setTimeout(() => {
            show.style.display = "none";
            itemShowContainer.style.display = "none";
            document.getElementById("item-name-show").innerHTML = "";
            document.getElementById("item-image-show").src = "";
            document.getElementById("item-imageblur-show").src = "";
            document.getElementById("item-description-show").innerHTML = "";
            document.getElementById("item-id-show").innerHTML = "";
        }, 500);
    }

    document.getElementById("back")?.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "dashboard.html";
    });

    document
        .getElementById("item-show-close")
        ?.addEventListener("click", (e) => {
            e.preventDefault();
            toggleItemShow();
        });

    document.getElementById("edit-item")?.addEventListener("click", (e) => {
        e.preventDefault();
        const name = document.getElementById("item-name-show").innerHTML;
        const description = document.getElementById(
            "item-description-show"
        ).innerHTML;
        const itemId = document.getElementById("item-id-show").innerHTML;
        toggleItemShow();
        toggleItemEditForm(name, description, itemId);
    });

    document.getElementById("delete-item")?.addEventListener("click", (e) => {
        e.preventDefault();
        const itemId = document.getElementById("item-id-show").innerHTML;
        toggleItemShow();
        deleteItem(itemId);
    });

    document
        .getElementById("collectionCancel")
        ?.addEventListener("click", (e) => {
            e.preventDefault();
            toggleCollectionForm();
        });

    document.getElementById("itemCancel")?.addEventListener("click", (e) => {
        e.preventDefault();
        toggleItemForm();
    });

    document
        .getElementById("collectionEditCancel")
        ?.addEventListener("click", (e) => {
            e.preventDefault();
            toggleCollectionEditForm();
        });

    document
        .getElementById("itemEditCancel")
        ?.addEventListener("click", (e) => {
            e.preventDefault();
            toggleItemEditForm();
        });

    document
        .getElementById("collection-create")
        ?.addEventListener("click", (e) => {
            e.preventDefault();
            toggleCollectionForm();
        });
    document.getElementById("item-create")?.addEventListener("click", (e) => {
        e.preventDefault();
        toggleItemForm();
    });

    // Eventos de Formulário
    document
        .getElementById("loginForm")
        ?.addEventListener("submit", function (e) {
            e.preventDefault();
            login();
        });

    document
        .getElementById("registerForm")
        ?.addEventListener("submit", function (e) {
            e.preventDefault();
            register();
        });

    document
        .getElementById("collectionForm")
        ?.addEventListener("submit", function (e) {
            e.preventDefault();
            createCollection();
        });

    document
        .getElementById("collectionEditForm")
        ?.addEventListener("submit", function (e) {
            e.preventDefault();
            editCollection();
        });

    document
        .getElementById("itemForm")
        ?.addEventListener("submit", function (e) {
            e.preventDefault();
            createItem();
        });

    document
        .getElementById("itemEditForm")
        ?.addEventListener("submit", function (e) {
            e.preventDefault();
            editItem();
        });
});
