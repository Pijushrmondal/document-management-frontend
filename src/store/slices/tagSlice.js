import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tagService from '../../services/tagService';
import { SUCCESS_MESSAGES } from '../../utils/constants';
import toast from 'react-hot-toast';

const initialState = {
    tags: [],
    folders: [],
    currentFolder: null,
    folderDocuments: [],
    loading: false,
    error: null,
};

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

export const deleteTag = createAsyncThunk(
    'tags/delete',
    async (id, { rejectWithValue }) => {
        try {
            await tagService.delete(id);
            toast.success(SUCCESS_MESSAGES.TAG_DELETE);
            return id;
        } catch (error) {
            let errorMessage = 'Failed to delete tag';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message && error.message !== 'Failed to delete tag') {
                errorMessage = error.message;
            }
            
            return rejectWithValue(errorMessage);
        }
    }
);

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

const tagSlice = createSlice({
    name: 'tags',
    initialState,
    reducers: {
        clearCurrentFolder: (state) => {
            state.currentFolder = null;
            state.folderDocuments = [];
        },

        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
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

        builder
            .addCase(fetchTagById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTagById.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(fetchTagById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

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