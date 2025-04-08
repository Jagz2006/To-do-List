const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const themeToggle = document.getElementById('theme-toggle');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';


function renderTasks() {
  taskList.innerHTML = '';

  let filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.draggable = true;
    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button class="delete-btn" onclick="deleteTask(${index})">✖</button>
      </div>
    `;
    li.addEventListener('click', () => toggleTask(index));
    li.addEventListener('dragstart', () => li.classList.add('dragging'));
    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');
      updateOrder();
    });

    taskList.appendChild(li);
  });

  addDragEvents();
}

function addTask() {
  const text = taskInput.value.trim();
  if (text === '') return;
  tasks.push({ text, completed: false });
  taskInput.value = '';
  saveAndRender();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveAndRender();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// ---------------- Filtering ----------------
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// ---------------- Theme Toggle ----------------
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

// ---------------- Drag & Drop ----------------
function addDragEvents() {
  const listItems = [...taskList.children];

  listItems.forEach(item => {
    item.addEventListener('dragover', e => e.preventDefault());
    item.addEventListener('dragenter', e => e.preventDefault());
    item.addEventListener('drop', e => {
      const dragging = document.querySelector('.dragging');
      const dropIndex = listItems.indexOf(item);
      const dragIndex = listItems.indexOf(dragging);
      if (dragIndex === -1 || dropIndex === -1) return;

      const itemToMove = tasks.splice(dragIndex, 1)[0];
      tasks.splice(dropIndex, 0, itemToMove);
      saveAndRender();
    });
  });
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});

// Initial load
renderTasks();
