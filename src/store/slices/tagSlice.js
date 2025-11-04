// src/store/slices/tagSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tagService from '../../services/tagService';
import { SUCCESS_MESSAGES } from '../../utils/constants';
import toast from 'react-hot-toast';

/**
 * Initial state
 */
const initialState = {
    tags: [],
    folders: [],
    currentFolder: null,
    folderDocuments: [],
    loading: false,
    error: null,
};

/**
 * Async thunk: Fetch all tags
 */
export const fetchTags = createAsyncThunk(
    'tags/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await tagService.getAll();
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch tags');
        }
    }
);

/**
 * Async thunk: Fetch tag by ID
 */
export const fetchTagById = createAsyncThunk(
    'tags/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await tagService.getById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch tag');
        }
    }
);

/**
 * Async thunk: Create tag
 */
export const createTag = createAsyncThunk(
    'tags/create',
    async (name, { rejectWithValue }) => {
        try {
            const response = await tagService.create(name);
            toast.success(SUCCESS_MESSAGES.TAG_CREATE);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to create tag');
        }
    }
);

/**
 * Async thunk: Delete tag
 */
export const deleteTag = createAsyncThunk(
    'tags/delete',
    async (id, { rejectWithValue }) => {
        try {
            await tagService.delete(id);
            toast.success(SUCCESS_MESSAGES.TAG_DELETE);
            return id;
        } catch (error) {
            // Extract error message from API response
            // The API interceptor may have already set error.message from error.response.data.message
            // But we check both to be safe
            let errorMessage = 'Failed to delete tag';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message && error.message !== 'Failed to delete tag') {
                // Use error.message if it's been set by the interceptor and is not the default
                errorMessage = error.message;
            }
            
            // Don't show toast here - errorMiddleware will handle it
            // Return the error message so middleware can display it
            return rejectWithValue(errorMessage);
        }
    }
);

/**
 * Async thunk: Fetch folders
 */
export const fetchFolders = createAsyncThunk(
    'tags/fetchFolders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await tagService.getFolders();
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch folders');
        }
    }
);

/**
 * Async thunk: Fetch folder documents
 */
export const fetchFolderDocuments = createAsyncThunk(
    'tags/fetchFolderDocuments',
    async (folderName, { rejectWithValue }) => {
        try {
            const response = await tagService.getFolderDocuments(folderName);
            return { folderName, documents: response };
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch folder documents');
        }
    }
);

/**
 * Tag slice
 */
const tagSlice = createSlice({
    name: 'tags',
    initialState,
    reducers: {
        // Clear current folder
        clearCurrentFolder: (state) => {
            state.currentFolder = null;
            state.folderDocuments = [];
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch tags
        builder
            .addCase(fetchTags.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.loading = false;
                state.tags = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchTags.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch tag by ID
        builder
            .addCase(fetchTagById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTagById.fulfilled, (state, action) => {
                state.loading = false;
                // Could store current tag if needed
            })
            .addCase(fetchTagById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Create tag
        builder
            .addCase(createTag.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTag.fulfilled, (state, action) => {
                state.loading = false;
                state.tags.push(action.payload);
            })
            .addCase(createTag.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Delete tag
        builder
            .addCase(deleteTag.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTag.fulfilled, (state, action) => {
                state.loading = false;
                state.tags = state.tags.filter((tag) => tag.id !== action.payload);
                state.folders = state.folders.filter((folder) => folder.id !== action.payload);
            })
            .addCase(deleteTag.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch folders
        builder
            .addCase(fetchFolders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFolders.fulfilled, (state, action) => {
                state.loading = false;
                state.folders = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchFolders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch folder documents
        builder
            .addCase(fetchFolderDocuments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFolderDocuments.fulfilled, (state, action) => {
                state.loading = false;
                state.currentFolder = action.payload.folderName;
                const documentsArray = action.payload.documents.docs ||
                    action.payload.documents.documents ||
                    (Array.isArray(action.payload.documents) ? action.payload.documents : []);
                state.folderDocuments = documentsArray;
            })
            .addCase(fetchFolderDocuments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions
export const { clearCurrentFolder, clearError } = tagSlice.actions;

// Export selectors
export const selectTags = (state) => state.tags.tags;
export const selectFolders = (state) => state.tags.folders;
export const selectCurrentFolder = (state) => state.tags.currentFolder;
export const selectFolderDocuments = (state) => state.tags.folderDocuments;
export const selectTagLoading = (state) => state.tags.loading;
export const selectTagError = (state) => state.tags.error;

// Export reducer
export default tagSlice.reducer;