"use client";

import { useEffect, useState } from 'react';
import { getDocuments, addDocument, updateDocument, deleteDocument } from '../../../services/firebaseCrud';
import ImageUpload from '../../../components/admin/ImageUpload';
import styles from '../admin.module.css';

export default function TechniciansPage() {
  const [techs, setTechs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [researchArea, setResearchArea] = useState('');

  const fetchTechs = async () => {
    setLoading(true);
    const data = await getDocuments('lab_technicians');
    setTechs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTechs();
  }, []);

  const resetForm = () => {
    setName('');
    setEmail('');
    setImage('');
    setResearchArea('');
    setCurrentEditId(null);
  };

  const handleOpenModal = (member?: any) => {
    if (member) {
      setName(member.name || '');
      setEmail(member.email || '');
      setImage(member.image || '');
      setResearchArea(member.researchArea || '');
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
    const data = { name, role: 'Lab Technician', email, image, researchArea };

    if (currentEditId) {
      await updateDocument('lab_technicians', currentEditId, data);
    } else {
      await addDocument('lab_technicians', data);
    }
    
    handleCloseModal();
    fetchTechs();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this Lab Technician?")) {
      await deleteDocument('lab_technicians', id);
      fetchTechs();
    }
  };

  return (
    <div>
      <div className={styles.cardHeader}>
        <h2>Manage Lab Technicians</h2>
        <button className={styles.btnPrimary} onClick={() => handleOpenModal()}>+ Add Technician</button>
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
                <th>Responsibilities</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {techs.map((member) => (
                <tr key={member.id}>
                  <td>
                    {member.image && <img src={member.image} alt={member.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />}
                  </td>
                  <td>{member.name}</td>
                  <td>{member.researchArea}</td>
                  <td className={styles.actions}>
                    <button className={styles.btnEdit} onClick={() => handleOpenModal(member)}>Edit</button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(member.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {techs.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center' }}>No lab technicians found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{currentEditId ? 'Edit Technician' : 'Add Technician'}</h2>
            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} />
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
                <label>Responsibilities</label>
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
