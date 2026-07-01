// Interactive Calendar & Task Planner modules

export class StudyPlanner {
  constructor(appState) {
    this.appState = appState;
    
    // Calendar state
    this.currentDate = new Date();
    this.selectedDateStr = this.formatDateStr(this.currentDate);
    
    // Tasks State (loaded from localStorage or empty)
    this.tasks = JSON.parse(localStorage.getItem("mentor_tasks")) || [
      { id: 1, title: "Solve 5 algebraic doubts with Sophia", date: this.formatDateStr(new Date()), completed: false },
      { id: 2, title: "Watch Physics Wallah Laws of Motion", date: this.formatDateStr(new Date()), completed: true },
      { id: 3, title: "Take syllabus mock test", date: this.formatDateStr(new Date()), completed: false }
    ];

    this.initializeUI();
  }

  initializeUI() {
    this.calendarTitle = document.getElementById("calendar-title");
    this.calendarDaysGrid = document.getElementById("calendar-days-grid");
    this.prevMonthBtn = document.getElementById("calendar-prev-month");
    this.nextMonthBtn = document.getElementById("calendar-next-month");
    
    this.plannerDateTitle = document.getElementById("planner-date-title");
    this.plannerTodoList = document.getElementById("planner-todo-list");
    this.btnAddTodo = document.getElementById("btn-add-todo");
    
    // Modal Goal elements
    this.todoModal = document.getElementById("todo-modal");
    this.closeTodoBtn = document.getElementById("close-todo-btn");
    this.todoCancelBtn = document.getElementById("todo-cancel-btn");
    this.todoSaveBtn = document.getElementById("todo-save-btn");
    
    this.todoTitleInput = document.getElementById("todo-title-input");
    this.todoDateInput = document.getElementById("todo-date-input");

    // Click Bindings
    this.prevMonthBtn.addEventListener("click", () => this.changeMonth(-1));
    this.nextMonthBtn.addEventListener("click", () => this.changeMonth(1));
    
    this.btnAddTodo.addEventListener("click", () => this.openGoalModal());
    this.closeTodoBtn.addEventListener("click", () => this.closeGoalModal());
    this.todoCancelBtn.addEventListener("click", () => this.closeGoalModal());
    this.todoSaveBtn.addEventListener("click", () => this.saveNewGoal());

    this.renderCalendar();
    this.renderTasks();
  }

  formatDateStr(dateObj) {
    const y = dateObj.getFullYear();
    const m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const d = dateObj.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  changeMonth(direction) {
    this.currentDate.setMonth(this.currentDate.getMonth() + direction);
    this.renderCalendar();
  }

  renderCalendar() {
    this.calendarDaysGrid.innerHTML = "";
    
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // Render Weekday headers
    const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    weekdays.forEach(day => {
      const el = document.createElement("div");
      el.className = "calendar-weekday";
      el.innerText = day;
      this.calendarDaysGrid.appendChild(el);
    });

    // Month details
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevTotalDays = new Date(year, month, 0).getDate();
    
    // Header title
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.calendarTitle.innerText = `${monthNames[month]} ${year}`;

    // 1. Previous Month Buffer Days
    for (let i = firstDayIndex; i > 0; i--) {
      const dayNum = prevTotalDays - i + 1;
      const dayEl = document.createElement("div");
      dayEl.className = "calendar-day inactive";
      dayEl.innerText = dayNum;
      this.calendarDaysGrid.appendChild(dayEl);
    }

    // 2. Active Month Days
    const today = new Date();
    const todayStr = this.formatDateStr(today);

    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      const dayEl = document.createElement("div");
      dayEl.className = "calendar-day";
      dayEl.innerText = dayNum;
      
      const currentLoopDate = new Date(year, month, dayNum);
      const dateStr = this.formatDateStr(currentLoopDate);

      // Check today
      if (dateStr === todayStr) {
        dayEl.classList.add("today");
      }

      // Check selected
      if (dateStr === this.selectedDateStr) {
        dayEl.classList.add("selected");
      }

      // Add Dots if there are tasks on this day
      const dayTasks = this.tasks.filter(t => t.date === dateStr);
      if (dayTasks.length > 0) {
        const dotContainer = document.createElement("div");
        dotContainer.className = "day-dot-container";
        
        // Show up to 3 dots
        dayTasks.slice(0, 3).forEach(task => {
          const dot = document.createElement("div");
          dot.className = `calendar-dot`;
          
          // Single color for all dots now
          dot.style.background = "var(--color-primary-school)";
          
          dotContainer.appendChild(dot);
        });
        dayEl.appendChild(dotContainer);
      }

      // Day Click Action
      dayEl.addEventListener("click", () => {
        this.selectedDateStr = dateStr;
        
        // Re-render to update selected styling
        document.querySelectorAll(".calendar-day").forEach(el => el.classList.remove("selected"));
        dayEl.classList.add("selected");
        
        this.renderTasks();
      });

      this.calendarDaysGrid.appendChild(dayEl);
    }

    // 3. Next Month Buffer Days to complete grid
    const totalRendered = firstDayIndex + totalDays;
    const remaining = totalRendered % 7 === 0 ? 0 : 7 - (totalRendered % 7);
    for (let i = 1; i <= remaining; i++) {
      const dayEl = document.createElement("div");
      dayEl.className = "calendar-day inactive";
      dayEl.innerText = i;
      this.calendarDaysGrid.appendChild(dayEl);
    }
  }

  renderTasks() {
    this.plannerTodoList.innerHTML = "";
    
    // Update planner date title
    const selectedDateObj = new Date(this.selectedDateStr);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    this.plannerDateTitle.innerText = `Goals for ${selectedDateObj.toLocaleDateString('en-US', options)}`;

    const filtered = this.tasks.filter(t => t.date === this.selectedDateStr);
    
    // Update stats completion percentage
    this.updateStatsPercentage();

    // Notify global dashboard preview as well
    this.updateDashboardPreview();

    if (filtered.length === 0) {
      this.plannerTodoList.innerHTML = `
        <p class="text-secondary" style="font-size: 0.9rem; text-align: center; padding: 30px 0;">
          No study goals scheduled for this date.
        </p>
      `;
      return;
    }

    filtered.forEach(task => {
      const item = document.createElement("div");
      item.className = `todo-item ${task.completed ? 'completed' : ''}`;
      
      item.innerHTML = `
        <div class="todo-item-left">
          <div class="todo-checkbox" data-id="${task.id}">
            <i class="fa-solid fa-check"></i>
          </div>
          <div>
            <span class="todo-text">${task.title}</span>
          </div>
        </div>
        <button class="btn-todo-delete" data-id="${task.id}">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      `;

      // Checkbox click
      item.querySelector(".todo-checkbox").addEventListener("click", () => {
        this.toggleTaskCompleted(task.id);
      });

      // Delete click
      item.querySelector(".btn-todo-delete").addEventListener("click", () => {
        this.deleteTask(task.id);
      });

      this.plannerTodoList.appendChild(item);
    });
  }

  updateDashboardPreview() {
    const previewContainer = document.getElementById("db-todo-preview");
    if (!previewContainer) return;
    
    previewContainer.innerHTML = "";
    const todayStr = this.formatDateStr(new Date());
    const todayTasks = this.tasks.filter(t => t.date === todayStr);

    if (todayTasks.length === 0) {
      previewContainer.innerHTML = `
        <p class="text-secondary" style="font-size: 0.9rem; text-align: center; padding: 20px 0;">
          No tasks scheduled for today.
        </p>
      `;
      return;
    }

    todayTasks.forEach(task => {
      const item = document.createElement("div");
      item.className = `todo-item ${task.completed ? 'completed' : ''}`;
      item.style.padding = "8px 12px";
      item.innerHTML = `
        <div class="todo-item-left">
          <div class="todo-checkbox" data-id="${task.id}" style="pointer-events: none;">
            <i class="fa-solid fa-check"></i>
          </div>
          <span class="todo-text" style="font-size: 0.85rem;">${task.title}</span>
        </div>
      `;
      previewContainer.appendChild(item);
    });
  }

  toggleTaskCompleted(taskId) {
    this.tasks = this.tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });

    this.saveTasksToStorage();
    this.renderTasks();
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    
    this.saveTasksToStorage();
    this.renderCalendar(); // Redraw dots
    this.renderTasks();
  }

  saveTasksToStorage() {
    localStorage.setItem("mentor_tasks", JSON.stringify(this.tasks));
  }

  updateStatsPercentage() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    this.appState.updatePercentageStat(percent);
  }

  openGoalModal() {
    this.todoTitleInput.value = "";
    this.todoDateInput.value = this.selectedDateStr; // Defaults to selected calendar date
    this.todoModal.classList.add("active");
  }

  closeGoalModal() {
    this.todoModal.classList.remove("active");
  }

  saveNewGoal() {
    const title = this.todoTitleInput.value.trim();
    const date = this.todoDateInput.value;

    if (!title || !date) {
      alert("Please fill in all goal fields.");
      return;
    }

    const newGoal = {
      id: Date.now(),
      title,
      date,
      completed: false
    };

    this.tasks.push(newGoal);
    this.saveTasksToStorage();
    
    this.closeGoalModal();
    this.renderCalendar(); // Re-render dots
    this.renderTasks();
  }
}
