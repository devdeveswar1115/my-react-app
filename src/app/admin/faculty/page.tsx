"use client";

import { useEffect, useState } from 'react';
import { getDocuments, addDocument, updateDocument, deleteDocument } from '../../../services/firebaseCrud';
import ImageUpload from '../../../components/admin/ImageUpload';
import styles from '../admin.module.css';

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [researchAreas, setResearchAreas] = useState('');
  const [bio, setBio] = useState('');

  const fetchFaculty = async () => {
    setLoading(true);
    const data = await getDocuments('faculty');
    const filteredFaculty = data.filter((f: any) => f.designation?.toLowerCase() !== 'founder');
    setFaculty(filteredFaculty);
    setLoading(false);
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const resetForm = () => {
    setName('');
    setDesignation('');
    setEmail('');
    setImage('');
    setResearchAreas('');
    setBio('');
    setCurrentEditId(null);
  };

  const handleOpenModal = (fac?: any) => {
    if (fac) {
      setName(fac.name || '');
      setDesignation(fac.designation || '');
      setEmail(fac.email || '');
      setImage(fac.image || '');
      setResearchAreas(fac.researchAreas || '');
      setBio(fac.bio || '');
      setCurrentEditId(fac.id);
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
    const data = { name, designation, email, image, researchAreas, bio };

    if (currentEditId) {
      await updateDocument('faculty', currentEditId, data);
    } else {
      await addDocument('faculty', data);
    }
    
    handleCloseModal();
    fetchFaculty();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this faculty member?")) {
      await deleteDocument('faculty', id);
      fetchFaculty();
    }
  };

  return (
    <div>
      <div className={styles.cardHeader}>
        <h2>Manage Faculty</h2>
        <button className={styles.btnPrimary} onClick={() => handleOpenModal()}>+ Add Faculty</button>
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
              {faculty.map((fac) => (
                <tr key={fac.id}>
                  <td>
                    {fac.image && <img src={fac.image} alt={fac.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />}
                  </td>
                  <td>{fac.name}</td>
                  <td>{fac.designation}</td>
                  <td className={styles.actions}>
                    <button className={styles.btnEdit} onClick={() => handleOpenModal(fac)}>Edit</button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(fac.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {faculty.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center' }}>No faculty found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{currentEditId ? 'Edit Faculty' : 'Add Faculty'}</h2>
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
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Image</label>
                <ImageUpload folder="faculty" currentImageUrl={image} onUploadSuccess={url => setImage(url)} />
              </div>
              <div className={styles.formGroup}>
                <label>Research Areas</label>
                <input value={researchAreas} onChange={e => setResearchAreas(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Bio</label>
                <textarea 
                  value={bio} 
                  onChange={e => setBio(e.target.value)} 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
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
