import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Search, BookOpen, Calendar, User, FileText, LogOut, Plus } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  description: string;
  image_url: string;
  extracted_text: string;
  created_at: string;
  subject_id: string;
  subjects: {
    name: string;
  };
  profiles: {
    full_name: string;
  };
}

interface NotesRepositoryProps {
  onUploadClick: () => void;
}

export function NotesRepository({ onUploadClick }: NotesRepositoryProps) {
  const { signOut } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [notes, searchQuery, selectedSubject]);

  const loadData = async () => {
    setLoading(true);

    const [notesResult, subjectsResult] = await Promise.all([
      supabase
        .from('notes')
        .select(`
          *,
          subjects (name),
          profiles (full_name)
        `)
        .order('created_at', { ascending: false }),
      supabase
        .from('subjects')
        .select('id, name')
        .order('name'),
    ]);

    if (notesResult.data) {
      setNotes(notesResult.data as Note[]);
    }

    if (subjectsResult.data) {
      setSubjects(subjectsResult.data);
    }

    setLoading(false);
  };

  const filterNotes = () => {
    let filtered = [...notes];

    if (selectedSubject !== 'all') {
      filtered = filtered.filter((note) => note.subject_id === selectedSubject);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.description.toLowerCase().includes(query) ||
          note.extracted_text.toLowerCase().includes(query) ||
          note.subjects.name.toLowerCase().includes(query)
      );
    }

    setFilteredNotes(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Repositorio de Apuntes
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onUploadClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Subir Apunte
              </button>
              <button
                onClick={signOut}
                className="p-2 text-gray-600 hover:text-gray-900 transition"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en apuntes, títulos, descripciones..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">Todas las materias</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || selectedSubject !== 'all'
                ? 'No se encontraron apuntes'
                : 'No hay apuntes todavía'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedSubject !== 'all'
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza subiendo tu primer apunte'}
            </p>
            {!searchQuery && selectedSubject === 'all' && (
              <button
                onClick={onUploadClick}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Subir Primer Apunte
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden group"
              >
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={note.image_url}
                    alt={note.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {note.subjects.name}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {note.title}
                  </h3>
                  {note.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {note.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {note.profiles.full_name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(note.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedNote && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedNote(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedNote.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 font-medium rounded-full">
                      {selectedNote.subjects.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {selectedNote.profiles.full_name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(selectedNote.created_at)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {selectedNote.description && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Descripción
                  </h3>
                  <p className="text-gray-600">{selectedNote.description}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Imagen del Apunte
                </h3>
                <img
                  src={selectedNote.image_url}
                  alt={selectedNote.title}
                  className="w-full rounded-lg border border-gray-200"
                />
              </div>

              {selectedNote.extracted_text && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-gray-700" />
                    <h3 className="text-sm font-semibold text-gray-700">
                      Texto Extraído
                    </h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-wrap font-mono text-sm">
                      {selectedNote.extracted_text}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
