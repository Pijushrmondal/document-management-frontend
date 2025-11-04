import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import documentService from '../../services/documentService';
import { SUCCESS_MESSAGES } from '../../utils/constants';
import toast from 'react-hot-toast';

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
    viewMode: 'grid',
    error: null,
};

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

const documentSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        setViewMode: (state, action) => {
            state.viewMode = action.payload;
        },

        setUploadProgress: (state, action) => {
            const { fileId, progress } = action.payload;
            state.uploadProgress[fileId] = progress;
        },

        clearUploadProgress: (state) => {
            state.uploadProgress = {};
        },

        clearSearchResults: (state) => {
            state.searchResults = [];
        },

        clearCurrentDocument: (state) => {
            state.currentDocument = null;
        },

        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDocuments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDocuments.fulfilled, (state, action) => {
                state.loading = false;
                const documentsArray = action.payload.documents || action.payload.docs ||
                    (Array.isArray(action.payload) ? action.payload : []);
                state.documents = documentsArray;
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

        builder
            .addCase(searchDocuments.pending, (state) => {
                state.searching = true;
                state.error = null;
            })
            .addCase(searchDocuments.fulfilled, (state, action) => {
                state.searching = false;
                let documentsArray = [];

                if (action.payload?.documentIds && Array.isArray(action.payload.documentIds)) {
                    const folderName = action.payload.folder || action.payload.folderName;
                    documentsArray = action.payload.documentIds
                        .map((item) => {
                            const doc = item.documentId || item;
                            return {
                                id: doc._id || doc.id,
                                filename: doc.filename,
                                fileSize: doc.fileSize,
                                filePath: doc.filePath,
                                mimeType: doc.mimeType,
                                textContent: doc.textContent,
                                createdAt: doc.createdAt,
                                updatedAt: doc.updatedAt,
                                ownerId: doc.ownerId,
                                primaryTag: folderName,
                                tagId: item.tagId,
                                isPrimary: item.isPrimary,
                                secondaryTags: [],
                                _id: doc._id,
                            };
                        });
                } else if (Array.isArray(action.payload)) {
                    documentsArray = action.payload;
                } else if (action.payload?.data && Array.isArray(action.payload.data)) {
                    documentsArray = action.payload.data;
                } else if (action.payload?.documents && Array.isArray(action.payload.documents)) {
                    documentsArray = action.payload.documents;
                } else if (action.payload?.docs && Array.isArray(action.payload.docs)) {
                    documentsArray = action.payload.docs;
                } else if (action.payload?.results && Array.isArray(action.payload.results)) {
                    documentsArray = action.payload.results;
                }

                if (import.meta.env.DEV) {
                    console.log('Search response:', action.payload);
                    console.log('Parsed documents:', documentsArray);
                }

                state.searchResults = documentsArray;
            })
            .addCase(searchDocuments.rejected, (state, action) => {
                state.searching = false;
                state.error = action.payload;
            });

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

        builder
            .addCase(fetchDocumentsByFolder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDocumentsByFolder.fulfilled, (state, action) => {
                state.loading = false;

                let documentsArray = [];

                if (Array.isArray(action.payload)) {
                    documentsArray = action.payload;
                } else if (action.payload?.data && Array.isArray(action.payload.data)) {
                    documentsArray = action.payload.data;
                } else if (action.payload?.documents && Array.isArray(action.payload.documents)) {
                    documentsArray = action.payload.documents;
                } else if (action.payload?.docs && Array.isArray(action.payload.docs)) {
                    documentsArray = action.payload.docs;
                } else if (action.payload?.results && Array.isArray(action.payload.results)) {
                    documentsArray = action.payload.results;
                }

                if (import.meta.env.DEV) {
                    console.log('Folder documents response:', action.payload);
                    console.log('Parsed documents:', documentsArray);
                }

                state.documents = documentsArray;
            })
            .addCase(fetchDocumentsByFolder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    setViewMode,
    setUploadProgress,
    clearUploadProgress,
    clearSearchResults,
    clearCurrentDocument,
    clearError,
} = documentSlice.actions;

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

export default documentSlice.reducer;