// src/store/slices/documentSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import documentService from '../../services/documentService';
import { SUCCESS_MESSAGES } from '../../utils/constants';
import toast from 'react-hot-toast';

/**
 * Initial state
 */
const initialState = {
    documents: [],
    currentDocument: null,
    searchResults: [],
    pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    },
    loading: false,
    uploading: false,
    uploadProgress: {},
    searching: false,
    viewMode: 'grid', // grid or list
    error: null,
};

/**
 * Async thunk: Fetch documents
 */
export const fetchDocuments = createAsyncThunk(
    'documents/fetchAll',
    async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
        try {
            const response = await documentService.getAll(page, limit);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch documents');
        }
    }
);

/**
 * Async thunk: Fetch document by ID
 */
export const fetchDocumentById = createAsyncThunk(
    'documents/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await documentService.getById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch document');
        }
    }
);

/**
 * Async thunk: Upload document
 */
export const uploadDocument = createAsyncThunk(
    'documents/upload',
    async ({ file, primaryTag, secondaryTags }, { rejectWithValue, dispatch }) => {
        try {
            const response = await documentService.upload(
                file,
                primaryTag,
                secondaryTags,
                (progress) => {
                    dispatch(setUploadProgress({ fileId: file.name, progress }));
                }
            );

            toast.success(SUCCESS_MESSAGES.DOCUMENT_UPLOAD);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to upload document');
        }
    }
);

/**
 * Async thunk: Search documents
 */
export const searchDocuments = createAsyncThunk(
    'documents/search',
    async ({ query, scope, ids }, { rejectWithValue }) => {
        try {
            const response = await documentService.search(query, scope, ids);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to search documents');
        }
    }
);

/**
 * Async thunk: Download document
 */
export const downloadDocument = createAsyncThunk(
    'documents/download',
    async ({ id, filename }, { rejectWithValue }) => {
        try {
            await documentService.download(id, filename);
            toast.success('Document downloaded successfully');
            return { id };
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to download document');
        }
    }
);

/**
 * Async thunk: Delete document
 */
export const deleteDocument = createAsyncThunk(
    'documents/delete',
    async (id, { rejectWithValue }) => {
        try {
            await documentService.delete(id);
            toast.success(SUCCESS_MESSAGES.DOCUMENT_DELETE);
            return id;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to delete document');
        }
    }
);

/**
 * Async thunk: Fetch documents by folder
 */
export const fetchDocumentsByFolder = createAsyncThunk(
    'documents/fetchByFolder',
    async (folderName, { rejectWithValue }) => {
        try {
            const response = await documentService.getByFolder(folderName);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch documents');
        }
    }
);

/**
 * Document slice
 */
const documentSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        // Set view mode
        setViewMode: (state, action) => {
            state.viewMode = action.payload;
        },

        // Set upload progress
        setUploadProgress: (state, action) => {
            const { fileId, progress } = action.payload;
            state.uploadProgress[fileId] = progress;
        },

        // Clear upload progress
        clearUploadProgress: (state) => {
            state.uploadProgress = {};
        },

        // Clear search results
        clearSearchResults: (state) => {
            state.searchResults = [];
        },

        // Clear current document
        clearCurrentDocument: (state) => {
            state.currentDocument = null;
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch documents
        builder
            .addCase(fetchDocuments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDocuments.fulfilled, (state, action) => {
                state.loading = false;
                state.documents = action.payload.docs || action.payload;
                state.pagination = {
                    page: action.payload.page || 1,
                    limit: action.payload.limit || 20,
                    total: action.payload.total || 0,
                    totalPages: action.payload.totalPages || 1,
                };
            })
            .addCase(fetchDocuments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch document by ID
        builder
            .addCase(fetchDocumentById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDocumentById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentDocument = action.payload;
            })
            .addCase(fetchDocumentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Upload document
        builder
            .addCase(uploadDocument.pending, (state) => {
                state.uploading = true;
                state.error = null;
            })
            .addCase(uploadDocument.fulfilled, (state, action) => {
                state.uploading = false;
                state.documents.unshift(action.payload);
                state.uploadProgress = {};
            })
            .addCase(uploadDocument.rejected, (state, action) => {
                state.uploading = false;
                state.error = action.payload;
                state.uploadProgress = {};
            });

        // Search documents
        builder
            .addCase(searchDocuments.pending, (state) => {
                state.searching = true;
                state.error = null;
            })
            .addCase(searchDocuments.fulfilled, (state, action) => {
                state.searching = false;
                state.searchResults = action.payload.docs || action.payload;
            })
            .addCase(searchDocuments.rejected, (state, action) => {
                state.searching = false;
                state.error = action.payload;
            });

        // Download document
        builder
            .addCase(downloadDocument.pending, (state) => {
                state.loading = true;
            })
            .addCase(downloadDocument.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(downloadDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Delete document
        builder
            .addCase(deleteDocument.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.documents = state.documents.filter((doc) => doc.id !== action.payload);
                state.searchResults = state.searchResults.filter((doc) => doc.id !== action.payload);
            })
            .addCase(deleteDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch documents by folder
        builder
            .addCase(fetchDocumentsByFolder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDocumentsByFolder.fulfilled, (state, action) => {
                state.loading = false;
                state.documents = action.payload.docs || action.payload;
            })
            .addCase(fetchDocumentsByFolder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions
export const {
    setViewMode,
    setUploadProgress,
    clearUploadProgress,
    clearSearchResults,
    clearCurrentDocument,
    clearError,
} = documentSlice.actions;

// Export selectors
export const selectDocuments = (state) => state.documents.documents;
export const selectCurrentDocument = (state) => state.documents.currentDocument;
export const selectSearchResults = (state) => state.documents.searchResults;
export const selectPagination = (state) => state.documents.pagination;
export const selectDocumentLoading = (state) => state.documents.loading;
export const selectDocumentUploading = (state) => state.documents.uploading;
export const selectUploadProgress = (state) => state.documents.uploadProgress;
export const selectSearching = (state) => state.documents.searching;
export const selectViewMode = (state) => state.documents.viewMode;
export const selectDocumentError = (state) => state.documents.error;

// Export reducer
export default documentSlice.reducer;