(function() {
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createAppItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrap = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название вашего дела';
        buttonWrap.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить';

        button.disabled = true;
        input.addEventListener('input', function() {
            if (input.value.length > 0) {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        });

        buttonWrap.append(button);
        form.append(input);
        form.append(buttonWrap);

        return {
            form,
            input,
            button,
        };
    }

    function createAppList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createAppItem(obj) {
        let item = document.createElement('li');
        let btnGroup = document.createElement('div');
        let doneBtn = document.createElement('button');
        let removeBtn = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = obj.name;

        if (obj.done) {
            item.classList.add('list-group-item-success');
        };

        btnGroup.classList.add('btn-group', 'btn-group-sm');
        doneBtn.classList.add('btn', 'btn-success');
        doneBtn.textContent = 'Выполнено';
        removeBtn.classList.add('btn', 'btn-danger');
        removeBtn.textContent = 'Удалить';

        btnGroup.append(doneBtn);
        btnGroup.append(removeBtn);
        item.append(btnGroup);

        return {
            item,
            doneBtn,
            removeBtn,
        }
    }

    function createId(arr) {
        if (arr.length > 0) {
            let maxIdItem = arr.reduce((max, current) => max.id > current.id ? max : current);
            return maxIdItem.id + 1;
        } else {
            return 1;
        };
    }

    function createTodoApp(container, title = 'Список дел', listName) {
        let todoAppTitle = createAppTitle(title);
        let todoAppItemForm = createAppItemForm();
        let todoAppList = createAppList();
        let tasks = JSON.parse(localStorage.getItem(listName)) || [];
        
        container.append(todoAppTitle);
        container.append(todoAppItemForm.form);
        container.append(todoAppList);

        if (tasks.length) {
            tasks.forEach(function(task) {
                let items = createAppItem(task);
                todoAppList.append(items.item);

                items.doneBtn.addEventListener('click', function() {
                    items.item.classList.toggle('list-group-item-success');
                    if (task.done === false) {
                        task.done = true;
                    } else {
                        task.done = false;
                    };
                    localStorage.setItem(listName, JSON.stringify(tasks));
                });
                items.removeBtn.addEventListener('click', function() {
                    if (confirm('Вы уверены?')) {
                        items.item.remove();
                        tasks.splice(tasks.indexOf(task), 1);
                        localStorage.setItem(listName, JSON.stringify(tasks));
                    }
                });
            });
        };


        todoAppItemForm.form.addEventListener('submit', function(elem) {
            elem.preventDefault();

            if(!todoAppItemForm.input.value) {
                return;
            }

            let task = {
                id: createId(tasks),
                name: todoAppItemForm.input.value,
                done: false,
                listName,
            };

            tasks.push(task);

            let todoAppItem = createAppItem(task);

            todoAppItem.doneBtn.addEventListener('click', function() {
                todoAppItem.item.classList.toggle('list-group-item-success');
                if (task.done === false) {
                    task.done = true;
                } else {
                    task.done = false;
                };
                localStorage.setItem(listName, JSON.stringify(tasks));
            });

            todoAppItem.removeBtn.addEventListener('click', function() {
                if (confirm('Вы уверены?')) {
                    todoAppItem.item.remove();
                    tasks.splice(tasks.indexOf(task), 1);
                    localStorage.setItem(listName, JSON.stringify(tasks));
                }
            });

            todoAppList.append(todoAppItem.item);

            localStorage.setItem(listName, JSON.stringify(tasks));

            todoAppItemForm.input.value = '';
            todoAppItemForm.button.disabled = true;
        });
    }

    window.createTodoApp = createTodoApp;
})();