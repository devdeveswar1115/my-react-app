"use client";

import { useEffect, useState } from 'react';
import { getDocuments, addDocument, updateDocument, deleteDocument } from '../../../services/firebaseCrud';
import ImageUpload from '../../../components/admin/ImageUpload';
import styles from '../admin.module.css';

export default function LeadersPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [image, setImage] = useState('');
  const [talk, setTalk] = useState('');

  const fetchLeaders = async () => {
    setLoading(true);
    const data = await getDocuments('leaders');
    setLeaders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  const resetForm = () => {
    setName('');
    setDesignation('');
    setImage('');
    setTalk('');
    setCurrentEditId(null);
  };

  const handleOpenModal = (leader?: any) => {
    if (leader) {
      setName(leader.name || '');
      setDesignation(leader.designation || '');
      setImage(leader.image || '');
      setTalk(leader.talk || '');
      setCurrentEditId(leader.id);
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
    const data = { 
      name, 
      designation, 
      image, 
      talk 
    };

    if (currentEditId) {
      await updateDocument('leaders', currentEditId, data);
    } else {
      await addDocument('leaders', data);
    }
    
    handleCloseModal();
    fetchLeaders();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this Leader?")) {
      await deleteDocument('leaders', id);
      fetchLeaders();
    }
  };

  return (
    <div>
      <div className={styles.cardHeader}>
        <h2>Manage Leaders Voice</h2>
        <button className={styles.btnPrimary} onClick={() => handleOpenModal()}>+ Add Leader Message</button>
      </div>

      <div className={styles.card}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((leader) => (
                <tr key={leader.id}>
                  <td>
                    {leader.image && <img src={leader.image} alt={leader.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />}
                  </td>
                  <td>{leader.name}</td>
                  <td>{leader.designation}</td>
                  <td className={styles.actions}>
                    <button className={styles.btnEdit} onClick={() => handleOpenModal(leader)}>Edit</button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(leader.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {leaders.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center' }}>No leaders found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{currentEditId ? 'Edit Leader Message' : 'Add Leader Message'}</h2>
            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Designation</label>
                <input required value={designation} onChange={e => setDesignation(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Image</label>
                <ImageUpload folder="leaders" currentImageUrl={image} onUploadSuccess={url => setImage(url)} />
              </div>
              <div className={styles.formGroup}>
                <label>Message (Voice / Talk)</label>
                <textarea 
                  value={talk} 
                  onChange={e => setTalk(e.target.value)} 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  rows={6}
                  required
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
