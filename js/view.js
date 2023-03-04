import { getTodoList } from "./api.js";

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

function createAppItem(task, { onDone, onRemove }, tasks, owner, localMode) {
    const doneClass = 'list-group-item-success';
    const item = document.createElement('li');
    const btnGroup = document.createElement('div');
    const doneBtn = document.createElement('button');
    const removeBtn = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = task.name;

    if (task.done) {
        item.classList.add(doneClass);
    };

    btnGroup.classList.add('btn-group', 'btn-group-sm');
    doneBtn.classList.add('btn', 'btn-success');
    doneBtn.textContent = 'Выполнено';
    removeBtn.classList.add('btn', 'btn-danger');
    removeBtn.textContent = 'Удалить';

    doneBtn.addEventListener('click', function() {
        onDone(task, localMode);
        item.classList.toggle(doneClass, task.done);
        if (localMode) {
            localStorage.setItem(owner, JSON.stringify(tasks));
        }
    });
    removeBtn.addEventListener('click', function() {
        onRemove({ task, element: item }, localMode);
        if (localMode) {
            tasks.splice(tasks.indexOf(task), 1);
            localStorage.setItem(owner, JSON.stringify(tasks));
        }
    });

    btnGroup.append(doneBtn);
    btnGroup.append(removeBtn);
    item.append(btnGroup);

    return item;
}

async function createTodoApp(container, { 
    title = 'Список дел', 
    owner,
    localMode,
    tasks = [],
    onCreateFormSubmit,
    onDoneClick,
    onDeleteClick,
}) {
    const todoAppTitle = createAppTitle(title);
    const todoAppItemForm = createAppItemForm();
    const todoAppList = createAppList();
    const handlers = { onDone: onDoneClick, onRemove: onDeleteClick };

    const switchBtn = document.querySelector('.switch-btn');
    (localMode) ? switchBtn.textContent = 'Переключить режим на серверный' : switchBtn.textContent = 'Переключить режим на локальный';

    switchBtn.addEventListener('click', () => {
        if (localMode) {
            localMode = false;
            switchBtn.textContent = 'Переключить режим на локальный';
        } else {
            localMode = true;
            switchBtn.textContent = 'Переключить режим на серверный';
        }
        localStorage.setItem('mode', JSON.stringify(localMode));
        location.reload();

    })
    
    container.append(todoAppTitle);
    container.append(todoAppItemForm.form);
    container.append(todoAppList);

    // Формируем элементы в DOM
    tasks.forEach(task => {
        const todoAppItem = createAppItem(task, handlers, tasks, owner, localMode);
        todoAppList.append(todoAppItem);
    });

    todoAppItemForm.form.addEventListener('submit', async e => {
        e.preventDefault();

        if(!todoAppItemForm.input.value) {
            return;
        }

        const task = await onCreateFormSubmit({
            owner,
            name: todoAppItemForm.input.value.trim(),
        }, localMode);

        tasks.push(task);

        const todoAppItem = createAppItem(task, handlers, tasks, owner, localMode);

        todoAppList.append(todoAppItem);

        if (localMode) localStorage.setItem(owner, JSON.stringify(tasks));

        todoAppItemForm.input.value = '';
        todoAppItemForm.button.disabled = true;
    });
}

export { createTodoApp };