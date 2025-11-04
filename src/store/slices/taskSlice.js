import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '../../services/taskService';
import { SUCCESS_MESSAGES } from '../../utils/constants';
import toast from 'react-hot-toast';

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

export const deleteTask = createAsyncThunk(
    'tasks/delete',
    async (id, { rejectWithValue }) => {
        try {
            await taskService.delete(id);
            toast.success(SUCCESS_MESSAGES.TASK_DELETE);
            return id;
        } catch (error) {
            let errorMessage = 'Failed to delete task';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message && error.message !== 'Failed to delete task') {
                errorMessage = error.message;
            }
            
            return rejectWithValue(errorMessage);
        }
    }
);

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

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        clearCurrentTask: (state) => {
            state.currentTask = null;
        },

        clearError: (state) => {
            state.error = null;
        },

        moveTask: (state, action) => {
            const { taskId, newStatus } = action.payload;
            const task = state.tasks.find(t => {
                const id = t.id || t._id;
                return id === taskId;
            });
            if (task) {
                task.status = newStatus;
            }
            const updateTaskInArray = (arr) => {
                if (!arr) return;
                const taskInArray = arr.find(t => {
                    const id = t.id || t._id;
                    return id === taskId;
                });
                if (taskInArray) {
                    taskInArray.status = newStatus;
                }
            };
            updateTaskInArray(state.todaysTasks);
            updateTaskInArray(state.overdueTasks);
        },
    },
    extraReducers: (builder) => {
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

        builder
            .addCase(updateTaskStatus.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            });

        builder
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload;
                state.tasks = state.tasks.filter(t => {
                    const taskId = t.id || t._id;
                    return taskId !== deletedId;
                });
                if (state.todaysTasks) {
                    state.todaysTasks = state.todaysTasks.filter(t => {
                        const taskId = t.id || t._id;
                        return taskId !== deletedId;
                    });
                }
                if (state.overdueTasks) {
                    state.overdueTasks = state.overdueTasks.filter(t => {
                        const taskId = t.id || t._id;
                        return taskId !== deletedId;
                    });
                }
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

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

export const { clearCurrentTask, clearError, moveTask } = taskSlice.actions;

export const selectTasks = (state) => state.tasks.tasks;
export const selectCurrentTask = (state) => state.tasks.currentTask;
export const selectTodaysTasks = (state) => state.tasks.todaysTasks;
export const selectOverdueTasks = (state) => state.tasks.overdueTasks;
export const selectTaskPagination = (state) => state.tasks.pagination;
export const selectTaskLoading = (state) => state.tasks.loading;
export const selectTaskError = (state) => state.tasks.error;

export const selectTasksByStatus = (kanbanStatus) => (state) => {
    const statusMap = {
        'todo': 'pending',
        'in_progress': 'in_progress',
        'done': 'completed',
    };
    
    const apiStatus = statusMap[kanbanStatus] || kanbanStatus;
    
    return state.tasks.tasks.filter(task => {
        const taskStatus = task.status || task.taskStatus;
        return taskStatus === apiStatus;
    });
};

export default taskSlice.reducer;