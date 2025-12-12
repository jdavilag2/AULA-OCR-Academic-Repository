import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { NotesRepository } from './components/NotesRepository';
import { UploadNote } from './components/UploadNote';

function AppContent() {
  const { user, loading } = useAuth();
  const [showUpload, setShowUpload] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <>
      <NotesRepository
        key={refreshKey}
        onUploadClick={() => setShowUpload(true)}
      />
      {showUpload && (
        <UploadNote
          onSuccess={() => {
            setShowUpload(false);
            setRefreshKey((prev) => prev + 1);
          }}
          onCancel={() => setShowUpload(false)}
        />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
