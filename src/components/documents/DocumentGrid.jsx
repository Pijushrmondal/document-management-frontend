import EmptyState from "../common/EmptyState";
import LoadingSpinner from "../common/LoadingSpinner";
import DocumentCard from "./DocumentCard";

function DocumentGrid({ documents, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const docArray = Array.isArray(documents) ? documents : [];

  if (docArray.length === 0) {
    return (
      <EmptyState
        icon="📄"
        title="No documents found"
        description="Upload your first document to get started."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {docArray.map((document) => (
        <DocumentCard key={document.id} document={document} />
      ))}
    </div>
  );
}

export default DocumentGrid;
