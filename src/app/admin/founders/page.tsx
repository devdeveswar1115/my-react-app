"use client";

import { useEffect, useState } from 'react';
import { getDocuments, addDocument, updateDocument, deleteDocument } from '../../../services/firebaseCrud';
import ImageUpload from '../../../components/admin/ImageUpload';
import styles from '../admin.module.css';

export default function FoundersPage() {
  const [founders, setFounders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [qualification, setQualification] = useState('');
  const [researchAreas, setResearchAreas] = useState('');
  const [bio, setBio] = useState('');

  const fetchFounders = async () => {
    setLoading(true);
    const data = await getDocuments('faculty');
    const filteredFounders = data.filter((f: any) => f.designation?.toLowerCase() === 'founder');
    setFounders(filteredFounders);
    setLoading(false);
  };

  useEffect(() => {
    fetchFounders();
  }, []);

  const resetForm = () => {
    setName('');
    setEmail('');
    setImage('');
    setQualification('');
    setResearchAreas('');
    setBio('');
    setCurrentEditId(null);
  };

  const handleOpenModal = (fac?: any) => {
    if (fac) {
      setName(fac.name || '');
      setEmail(fac.email || '');
      setImage(fac.image || '');
      setQualification(fac.qualification || '');
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
    const data = { 
      name, 
      designation: 'Founder', // Force designation
      email, 
      image, 
      qualification, 
      researchAreas,
      bio 
    };

    if (currentEditId) {
      await updateDocument('faculty', currentEditId, data);
    } else {
      await addDocument('faculty', data);
    }
    
    handleCloseModal();
    fetchFounders();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this Founder?")) {
      await deleteDocument('faculty', id);
      fetchFounders();
    }
  };

  return (
    <div>
      <div className={styles.cardHeader}>
        <h2>Manage Founders</h2>
        <button className={styles.btnPrimary} onClick={() => handleOpenModal()}>+ Add Founder</button>
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
                <th>Qualification</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {founders.map((fac) => (
                <tr key={fac.id}>
                  <td>
                    {fac.image && <img src={fac.image} alt={fac.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />}
                  </td>
                  <td>{fac.name}</td>
                  <td>{fac.qualification}</td>
                  <td className={styles.actions}>
                    <button className={styles.btnEdit} onClick={() => handleOpenModal(fac)}>Edit</button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(fac.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {founders.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center' }}>No founders found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{currentEditId ? 'Edit Founder' : 'Add Founder'}</h2>
            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Qualification (e.g. M.Pharm., Ph.D.)</label>
                <input value={qualification} onChange={e => setQualification(e.target.value)} />
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
                <label>Focus (Research Area)</label>
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
