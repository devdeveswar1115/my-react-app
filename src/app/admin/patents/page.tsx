"use client";

import { useEffect, useState } from 'react';
import { getDocuments, addDocument, updateDocument, deleteDocument } from '../../../services/firebaseCrud';
import styles from '../admin.module.css';

export default function PatentsPage() {
  const [patents, setPatents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');

  const fetchPatents = async () => {
    setLoading(true);
    const data = await getDocuments('patents');
    setPatents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPatents();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDetails('');
    setCurrentEditId(null);
  };

  const handleOpenModal = (pat?: any) => {
    if (pat) {
      setTitle(pat.title || '');
      setDetails(pat.details || '');
      setCurrentEditId(pat.id);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { title, details };

    if (currentEditId) {
      await updateDocument('patents', currentEditId, data);
    } else {
      await addDocument('patents', data);
    }
    
    handleCloseModal();
    fetchPatents();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this patent?")) {
      await deleteDocument('patents', id);
      fetchPatents();
    }
  };

  return (
    <div>
      <div className={styles.cardHeader}>
        <h2>Manage Patents & Tech Transfer</h2>
        <button className={styles.btnPrimary} onClick={() => handleOpenModal()}>+ Add Patent</button>
      </div>

      <div className={styles.card}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patents.map((pat) => (
                <tr key={pat.id}>
                  <td>{pat.title}</td>
                  <td>{pat.details?.substring(0, 50)}{pat.details?.length > 50 ? '...' : ''}</td>
                  <td className={styles.actions}>
                    <button className={styles.btnEdit} onClick={() => handleOpenModal(pat)}>Edit</button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(pat.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {patents.length === 0 && (
                <tr><td colSpan={3} style={{ textAlign: 'center' }}>No patents found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{currentEditId ? 'Edit Patent' : 'Add Patent'}</h2>
            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Details</label>
                <textarea 
                  value={details} 
                  onChange={e => setDetails(e.target.value)} 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-main)' }}
                  rows={4}
                />
              </div>
              
              <div className={styles.modalActions}>
                <button type="button" className={styles.btnCancel} onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className={styles.btnPrimary}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
