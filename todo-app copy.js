(function() {
    // создаём и возвращаем заголовок приложения
    function createAppTitle(title) {
        // создаём элемент h2
        let appTitle = document.createElement('h2');
        // записываем в h2 заголовок, переданный в аргументе при вызове функции
        appTitle.innerHTML = title;
        // возвращаем заголовок для последующего доступа к нему
        return appTitle;
    }

    // создаём и возвращаем форму для создания дела
    function createTodoItemForm() {
        // создаём элементы form, input, div, button
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        // добавляем классы элементам form, input для стилизации стилями bootstrap
        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        // указываем значение placeholder в input
        input.placeholder = 'Введите название нового дела';
        // добавляем классы для контейнера кнопки и самой кнопки для стилизации стилями bootstrap
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        // указываем наименоваие кнопки
        button.textContent = 'Добавить дело';

        // добавляем кнопку в контейнер кнопки
        buttonWrapper.append(button);
        // добавлеям input в форму
        form.append(input);
        // добавляем контейнер кнопки (уже с кнопкой) в форму
        form.append(buttonWrapper);

        // возвращаем форму, input и кнопку для последующего доступа к этим элементам
        return {
            form,
            input,
            button,
        };
    }

    // создаём и возвращаем список элементов
    function createTodoList() {
        // создаём элемент ul и присваиваем переменной list
        let list = document.createElement('ul');
        // добавляем класс bootstrap списку элементов для стилизации
        list.classList.add('list-group');
        // возвращаем список элементов
        return list;
    }
    
    // создаем и возвращаем элемент списка
    function createTodoItem(name) {
        // создаём элементы li, div, кнопку выполнения и кнопку удаления
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        // добавляем классы bootstrap элементу списка, делаем flex, располагаем правильно внутренние элементы
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        // добавляем наименование элемента списка из переданного аргумента при вызове функции
        item.textContent = name;

        // добавляем классы контейнеру кнопок, кнопкам и добавляем наименование кнопок
        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        // добавляем кнопку выполнение дела и его удаления из списка в контейнер кнопок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        // добавлем в элемент контейнер кнопок
        item.append(buttonGroup);

        // возвращаем элемент и две кнопки для дальнейшего доступа к этим элементам
        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    // вызываем приложение, добавляем функционал кнопок, очищаем строку 
    function createTodoApp(container, title = 'Список дел') {
        // вызываем функцию создания заголовка со значением переданного аргумента
        let todoAppTitle = createAppTitle(title);
        // вызываем функцию создания формы для создания дела
        let todoItemForm = createTodoItemForm();
        // вызываем функцию создания списка элементов
        let todoList = createTodoList();

        // добавляем в контейнер, переданный в аргументе заголовок, форму и список элементов
        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        // добавляем событие 'submit' в форме по добавлению элемента, а также, по выполнению дела и его удалению
        todoItemForm.form.addEventListener('submit', function(elem) {
            // убираем дефолтные действия браузера, а именно перезагрузку страницы при отправке формы
            elem.preventDefault();

            // если значение input пустое, то ничего не делаем и выходим из функции
            if (!todoItemForm.input.value) {
                return;
            }

            // вызываем создание элемента списка с введенным наименованием
            let todoItem = createTodoItem(todoItemForm.input.value);

            // добавлем событие клика по кнопке выполнения дела
            todoItem.doneButton.addEventListener('click', function() {
                // при нажатии на кнопку выполнения дела происходит добавление/удаление класса bootstrap, окрашивающего элемент в зеленый цвет
                todoItem.item.classList.toggle('list-group-item-success');
            });
            // добавляем событие клика по кнопке удаления дела
            todoItem.deleteButton.addEventListener('click', function() {
                // вызов окна с подтверждением удаления
                if (confirm('Вы уверены?')) {
                    // удаление элемента
                    todoItem.item.remove();
                }
            });

            // добавляем элемент в список элементов
            todoList.append(todoItem.item);

            // очищаем строку после добавление элемента
            todoItemForm.input.value = '';
        })
    }

    // делаем функцию createTodoApp глобальной для доступа из всех файлов
    window.createTodoApp = createTodoApp;
})();