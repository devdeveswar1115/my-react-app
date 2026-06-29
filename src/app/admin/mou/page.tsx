"use client";

import { useEffect, useState } from 'react';
import { getDocuments, addDocument, updateDocument, deleteDocument } from '../../../services/firebaseCrud';
import ImageUpload from '../../../components/admin/ImageUpload';
import styles from '../admin.module.css';

export default function MOUsPage() {
  const [mous, setMous] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  // Form State
  const [partner, setPartner] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const fetchMOUs = async () => {
    setLoading(true);
    const data = await getDocuments('mou');
    setMous(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMOUs();
  }, []);

  const resetForm = () => {
    setPartner('');
    setDescription('');
    setLogo('');
    setLinkUrl('');
    setCurrentEditId(null);
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setPartner(item.partner || '');
      setDescription(item.description || '');
      setLogo(item.logo || '');
      setLinkUrl(item.linkUrl || '');
      setCurrentEditId(item.id);
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
    const data = { partner, description, logo, linkUrl };

    if (currentEditId) {
      await updateDocument('mou', currentEditId, data);
    } else {
      await addDocument('mou', data);
    }
    
    handleCloseModal();
    fetchMOUs();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this MOU?")) {
      await deleteDocument('mou', id);
      fetchMOUs();
    }
  };

  return (
    <div>
      <div className={styles.cardHeader}>
        <h2>Manage Memorandums of Understanding (MOU)</h2>
        <button className={styles.btnPrimary} onClick={() => handleOpenModal()}>+ Add MOU</button>
      </div>

      <div className={styles.card}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Partner</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mous.map((item) => (
                <tr key={item.id}>
                  <td>{item.partner}</td>
                  <td>{item.description?.substring(0, 50)}{item.description?.length > 50 ? '...' : ''}</td>
                  <td className={styles.actions}>
                    <button className={styles.btnEdit} onClick={() => handleOpenModal(item)}>Edit</button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {mous.length === 0 && (
                <tr><td colSpan={3} style={{ textAlign: 'center' }}>No MOUs found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{currentEditId ? 'Edit MOU' : 'Add MOU'}</h2>
            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label>Partner / Institution</label>
                <input required value={partner} onChange={e => setPartner(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-main)' }}
                  rows={4}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Institution Logo</label>
                <ImageUpload folder="mou" currentImageUrl={logo} onUploadSuccess={url => setLogo(url)} />
              </div>
              <div className={styles.formGroup}>
                <label>More Information Link</label>
                <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="e.g. Google Drive PDF Link" />
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
