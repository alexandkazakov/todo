// Получаем список элементов
export async function getTodoList(owner, localMode) {
    let response = [];
    if (localMode) {
        response = JSON.parse(localStorage.getItem(owner)) || [];
    } else {
        response = await fetch(`http://localhost:3000/api/todos?owner=${owner}`);
        response = await response.json();
    }
    return response;
}

// создаем дело
export async function createTodoItem({ owner, name }, localMode) {
    let response = null;
    if (localMode) {
        response = {
            owner,
            name,
            done: false,
            id: Math.round(Math.random() * 100000),
        };
    } else {
        response = await fetch('http://localhost:3000/api/todos', {
            method: 'POST',
            body: JSON.stringify({
                name,
                owner,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        response = await response.json();
    }
    return response;
}

// отмечаем дело как выполненное
export function switchTodoItemDone(task, localMode) {
    task.done = !task.done;
    if (!localMode) {
        fetch(`http://localhost:3000/api/todos/${task.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ done: task.done })
        });
    }
}

// удаляем дело
export function removeTodoItem({ task, element }, localMode) {
    if (!confirm('Вы уверены?')) {
        return;
    }
    element.remove();
    if (!localMode) {
        fetch(`http://localhost:3000/api/todos/${task.id}`, {
            method: 'DELETE',
        });
    }
}