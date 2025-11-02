// src/store/slices/taskSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '../../services/taskService';
import { SUCCESS_MESSAGES } from '../../utils/constants';
import toast from 'react-hot-toast';

/**
 * Initial state
 */
const initialState = {
    tasks: [],
    currentTask: null,
    todaysTasks: [],
    overdueTasks: [],
    pagination: {
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
    },
    loading: false,
    error: null,
};

/**
 * Async thunk: Fetch tasks
 */
export const fetchTasks = createAsyncThunk(
    'tasks/fetchAll',
    async ({ page = 1, limit = 50 } = {}, { rejectWithValue }) => {
        try {
            const response = await taskService.getAll(page, limit);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch tasks');
        }
    }
);

/**
 * Async thunk: Fetch task by ID
 */
export const fetchTaskById = createAsyncThunk(
    'tasks/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await taskService.getById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch task');
        }
    }
);

/**
 * Async thunk: Create task
 */
export const createTask = createAsyncThunk(
    'tasks/create',
    async (taskData, { rejectWithValue }) => {
        try {
            const response = await taskService.create(taskData);
            toast.success(SUCCESS_MESSAGES.TASK_CREATE);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to create task');
        }
    }
);

/**
 * Async thunk: Update task
 */
export const updateTask = createAsyncThunk(
    'tasks/update',
    async ({ id, updates }, { rejectWithValue }) => {
        try {
            const response = await taskService.update(id, updates);
            toast.success(SUCCESS_MESSAGES.TASK_UPDATE);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update task');
        }
    }
);

/**
 * Async thunk: Update task status
 */
export const updateTaskStatus = createAsyncThunk(
    'tasks/updateStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await taskService.updateStatus(id, status);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update task status');
        }
    }
);

/**
 * Async thunk: Delete task
 */
export const deleteTask = createAsyncThunk(
    'tasks/delete',
    async (id, { rejectWithValue }) => {
        try {
            await taskService.delete(id);
            toast.success(SUCCESS_MESSAGES.TASK_DELETE);
            return id;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to delete task');
        }
    }
);

/**
 * Async thunk: Fetch today's tasks
 */
export const fetchTodaysTasks = createAsyncThunk(
    'tasks/fetchToday',
    async (_, { rejectWithValue }) => {
        try {
            const response = await taskService.getToday();
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch today\'s tasks');
        }
    }
);

/**
 * Async thunk: Fetch overdue tasks
 */
export const fetchOverdueTasks = createAsyncThunk(
    'tasks/fetchOverdue',
    async (_, { rejectWithValue }) => {
        try {
            const response = await taskService.getOverdue();
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch overdue tasks');
        }
    }
);

/**
 * Task slice
 */
const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        // Clear current task
        clearCurrentTask: (state) => {
            state.currentTask = null;
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Optimistic update for drag & drop
        moveTask: (state, action) => {
            const { taskId, newStatus } = action.payload;
            const task = state.tasks.find(t => t.id === taskId);
            if (task) {
                task.status = newStatus;
            }
        },
    },
    extraReducers: (builder) => {
        // Fetch tasks
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                const tasksArray = action.payload.tasks ||
                    action.payload.docs ||
                    (Array.isArray(action.payload) ? action.payload : []);
                state.tasks = tasksArray;
                state.pagination = {
                    page: action.payload.page || 1,
                    limit: action.payload.limit || 50,
                    total: action.payload.total || 0,
                    totalPages: action.payload.totalPages || 1,
                };
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch task by ID
        builder
            .addCase(fetchTaskById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTaskById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentTask = action.payload;
            })
            .addCase(fetchTaskById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Create task
        builder
            .addCase(createTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks.push(action.payload);
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Update task
        builder
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.tasks.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
                if (state.currentTask?.id === action.payload.id) {
                    state.currentTask = action.payload;
                }
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Update task status
        builder
            .addCase(updateTaskStatus.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            });

        // Delete task
        builder
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = state.tasks.filter(t => t.id !== action.payload);
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch today's tasks
        builder
            .addCase(fetchTodaysTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTodaysTasks.fulfilled, (state, action) => {
                state.loading = false;
                const tasksArray = action.payload.tasks ||
                    (Array.isArray(action.payload) ? action.payload : []);
                state.todaysTasks = tasksArray;
            })
            .addCase(fetchTodaysTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch overdue tasks
        builder
            .addCase(fetchOverdueTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOverdueTasks.fulfilled, (state, action) => {
                state.loading = false;
                const tasksArray = action.payload.tasks ||
                    (Array.isArray(action.payload) ? action.payload : []);
                state.overdueTasks = tasksArray;
            })
            .addCase(fetchOverdueTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions
export const { clearCurrentTask, clearError, moveTask } = taskSlice.actions;

// Export selectors
export const selectTasks = (state) => state.tasks.tasks;
export const selectCurrentTask = (state) => state.tasks.currentTask;
export const selectTodaysTasks = (state) => state.tasks.todaysTasks;
export const selectOverdueTasks = (state) => state.tasks.overdueTasks;
export const selectTaskPagination = (state) => state.tasks.pagination;
export const selectTaskLoading = (state) => state.tasks.loading;
export const selectTaskError = (state) => state.tasks.error;

// Selector: Get tasks by status
export const selectTasksByStatus = (status) => (state) => {
    return state.tasks.tasks.filter(task => task.status === status);
};

// Export reducer
export default taskSlice.reducer;