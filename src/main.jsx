import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { master_sessions, master_atoms } from './atomsdata.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5L2VJahLNK76xWxC7MjsGbbcf70HjARs",
  authDomain: "number-knowledge-71dba.firebaseapp.com",
  projectId: "number-knowledge-71dba",
  storageBucket: "number-knowledge-71dba.firebasestorage.app",
  messagingSenderId: "931772776390",
  appId: "1:931772776390:web:e6fddd88629bcf1d803cc7",
  measurementId: "G-QQ34HTK4CE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Main App Component
function App() {
  const [sessions, setSessions] = useState([]);
  const [atoms, setAtoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initLoading, setInitLoading] = useState(false);
  const [initSuccess, setInitSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch master_sessions collection
      const sessionsSnapshot = await getDocs(collection(db, 'master_sessions'));
      const sessionsData = sessionsSnapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));

      // Fetch master_atoms collection
      const atomsSnapshot = await getDocs(collection(db, 'master_atoms'));
      const atomsData = atomsSnapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));

      setSessions(sessionsData);
      setAtoms(atomsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const initializeDatabase = async () => {
    setInitLoading(true);
    setInitSuccess(false);
    setError(null);

    try {
      // Save master_sessions to Firestore
      console.log('Saving sessions...');
      for (const session of master_sessions) {
        const docId = `${session.session_id}-${session.strand}`;
        await setDoc(doc(db, 'master_sessions', docId), session);
      }

      // Save master_atoms to Firestore
      console.log('Saving atoms...');
      for (const atom of master_atoms) {
        await setDoc(doc(db, 'master_atoms', atom.atom_id), atom);
      }

      setInitSuccess(true);
      console.log('Database initialized successfully!');
      
      // Refresh the data
      await fetchData();
    } catch (err) {
      console.error('Error initializing database:', err);
      setError(err.message || String(err));
    } finally {
      setInitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Maths Mastery Dashboard
        </h1>

        {/* Admin Dashboard */}
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            🔧 Admin Dashboard
          </h2>
          <p className="text-gray-700 mb-4">
            Initialize the database with all sessions and atoms from atomsdata.js
          </p>
          
          <button
            onClick={initializeDatabase}
            disabled={initLoading}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
              initLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {initLoading ? '⏳ Initializing...' : '🚀 Initialize Database'}
          </button>

          {initSuccess && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded-lg">
              <p className="text-green-800 font-semibold">
                ✅ Success! Database initialized with {master_sessions.length} sessions and {master_atoms.length} atoms.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded-lg">
              <p className="text-red-800 font-semibold">
                ❌ Error: {error}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Sessions
            </h2>
            <p className="text-gray-600">
              Total Sessions: {sessions.length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Atoms
            </h2>
            <p className="text-gray-600">
              Total Atoms: {atoms.length}
            </p>
          </div>
        </div>

        {/* Add your dashboard components here */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Dashboard Content
          </h2>
          <p className="text-gray-600">
            Your dashboard components will go here.
          </p>
        </div>
      </div>
    </div>
  );
}

// Render the app
const root = createRoot(document.getElementById('root'));
root.render(<App />);
