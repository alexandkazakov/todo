(function() {
    function createAppTitle(title) {
        const appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createAppItemForm() {
        const form = document.createElement('form');
        const input = document.createElement('input');
        const buttonWrap = document.createElement('div');
        const button = document.createElement('button');

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
        const list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createAppItem(obj) {
        const item = document.createElement('li');
        const btnGroup = document.createElement('div');
        const doneBtn = document.createElement('button');
        const removeBtn = document.createElement('button');

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
            const maxIdItem = arr.reduce((max, current) => max.id > current.id ? max : current);
            return maxIdItem.id + 1;
        } else {
            return 1;
        };
    }

    function createTodoApp(container, title = 'Список дел', listName) {
        const todoAppTitle = createAppTitle(title);
        const todoAppItemForm = createAppItemForm();
        const todoAppList = createAppList();
        const tasks = JSON.parse(localStorage.getItem(listName)) || [];
        
        container.append(todoAppTitle);
        container.append(todoAppItemForm.form);
        container.append(todoAppList);

        if (tasks.length) {
            tasks.forEach(function(task) {
                const todoAppItem = createAppItem(task);
                todoAppList.append(todoAppItem.item);

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
            });
        };


        todoAppItemForm.form.addEventListener('submit', function(elem) {
            elem.preventDefault();

            if(!todoAppItemForm.input.value) {
                return;
            }

            const task = {
                id: createId(tasks),
                name: todoAppItemForm.input.value,
                done: false,
                listName,
            };

            tasks.push(task);

            const todoAppItem = createAppItem(task);

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