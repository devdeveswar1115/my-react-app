"use client";

import { useEffect, useState } from 'react';
import { getDocuments, addDocument, updateDocument, deleteDocument } from '../../../services/firebaseCrud';
import ImageUpload from '../../../components/admin/ImageUpload';
import styles from '../admin.module.css';

export default function LabEnvironmentAdminPage() {
  const [labImages, setLabImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  // Form State
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(''); // Stores the uploaded image URL

  const fetchLabImages = async () => {
    setLoading(true);
    const data = await getDocuments('labEnvironment');
    setLabImages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLabImages();
  }, []);

  const resetForm = () => {
    setCaption('');
    setImage('');
    setCurrentEditId(null);
  };

  const handleOpenModal = (a?: any) => {
    if (a) {
      setCaption(a.caption || '');
      setImage(a.imageUrl || '');
      setCurrentEditId(a.id);
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
    if (!image) {
      alert("Please upload an image first.");
      return;
    }
    const data = { caption, imageUrl: image };

    if (currentEditId) {
      await updateDocument('labEnvironment', currentEditId, data);
    } else {
      await addDocument('labEnvironment', data);
    }
    
    handleCloseModal();
    fetchLabImages();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      await deleteDocument('labEnvironment', id);
      fetchLabImages();
    }
  };

  return (
    <div>
      <div className={styles.cardHeader}>
        <h2>Manage Lab Environment Gallery</h2>
        <button className={styles.btnPrimary} onClick={() => handleOpenModal()}>+ Add Lab Image</button>
      </div>

      <div className={styles.card}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Caption Text (On Hover)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {labImages.map((a) => (
                <tr key={a.id}>
                  <td>
                    {a.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={a.imageUrl} alt={a.caption} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <div style={{ width: '80px', height: '60px', background: '#e2e8f0', borderRadius: '4px' }} />
                    )}
                  </td>
                  <td>{a.caption}</td>
                  <td className={styles.actions}>
                    <button className={styles.btnEdit} onClick={() => handleOpenModal(a)}>Edit</button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(a.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {labImages.length === 0 && (
                <tr><td colSpan={3} style={{ textAlign: 'center' }}>No lab environment images found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{currentEditId ? 'Edit Lab Image' : 'Add Lab Image'}</h2>
            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label>Caption Text (Shows on Hover)</label>
                <input required value={caption} onChange={e => setCaption(e.target.value)} placeholder="e.g. Main Laboratory" />
              </div>
              <div className={styles.formGroup}>
                <label>Upload Image</label>
                <ImageUpload folder="labEnvironment" currentImageUrl={image} onUploadSuccess={url => setImage(url)} />
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
