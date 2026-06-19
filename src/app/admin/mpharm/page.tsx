"use client";

import { useEffect, useState } from 'react';
import { getDocuments, addDocument, updateDocument, deleteDocument } from '../../../services/firebaseCrud';
import ImageUpload from '../../../components/admin/ImageUpload';
import styles from '../admin.module.css';

export default function MPharmPage() {
  const [mpharm, setMpharm] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [researchArea, setResearchArea] = useState('');
  const [year, setYear] = useState('');

  const fetchMpharm = async () => {
    setLoading(true);
    const data = await getDocuments('mpharm_students');
    setMpharm(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMpharm();
  }, []);

  const resetForm = () => {
    setName('');
    setEmail('');
    setImage('');
    setResearchArea('');
    setYear('');
    setCurrentEditId(null);
  };

  const handleOpenModal = (member?: any) => {
    if (member) {
      setName(member.name || '');
      setEmail(member.email || '');
      setImage(member.image || '');
      setResearchArea(member.researchArea || '');
      setYear(member.year || '');
      setCurrentEditId(member.id);
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
    const data = { name, role: 'MPharm Student', email, image, researchArea, year };

    if (currentEditId) {
      await updateDocument('mpharm_students', currentEditId, data);
    } else {
      await addDocument('mpharm_students', data);
    }
    
    handleCloseModal();
    fetchMpharm();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this MPharm Student?")) {
      await deleteDocument('mpharm_students', id);
      fetchMpharm();
    }
  };

  return (
    <div>
      <div className={styles.cardHeader}>
        <h2>Manage MPharm Students</h2>
        <button className={styles.btnPrimary} onClick={() => handleOpenModal()}>+ Add MPharm</button>
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
                <th>Year</th>
                <th>Research Topic</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mpharm.map((member) => (
                <tr key={member.id}>
                  <td>
                    {member.image && <img src={member.image} alt={member.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />}
                  </td>
                  <td>{member.name}</td>
                  <td>{member.year}</td>
                  <td>{member.researchArea}</td>
                  <td className={styles.actions}>
                    <button className={styles.btnEdit} onClick={() => handleOpenModal(member)}>Edit</button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(member.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {mpharm.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center' }}>No MPharm students found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{currentEditId ? 'Edit MPharm Student' : 'Add MPharm Student'}</h2>
            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Year / Timeline</label>
                <input value={year} onChange={e => setYear(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Image</label>
                <ImageUpload folder="staff" currentImageUrl={image} onUploadSuccess={url => setImage(url)} />
              </div>
              <div className={styles.formGroup}>
                <label>Research Topic</label>
                <textarea 
                  value={researchArea} 
                  onChange={e => setResearchArea(e.target.value)} 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  rows={3}
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
