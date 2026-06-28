"use client";

import { useEffect, useState } from 'react';
import { getDocuments, addDocument, updateDocument, deleteDocument } from '../../../services/firebaseCrud';
import ImageUpload from '../../../components/admin/ImageUpload';
import styles from '../admin.module.css';

export default function AchievementsAdminPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const fetchAchievements = async () => {
    setLoading(true);
    const data = await getDocuments('achievements');
    // sort by date descending
    const sortedData = data.sort((a: any, b: any) => {
       const dateA = new Date(a.date || 0).getTime();
       const dateB = new Date(b.date || 0).getTime();
       return dateB - dateA;
    });
    setAchievements(sortedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDate('');
    setBody('');
    setImage('');
    setLinkUrl('');
    setLinkText('');
    setCurrentEditId(null);
  };

  const handleOpenModal = (a?: any) => {
    if (a) {
      setTitle(a.title || '');
      setDate(a.date || '');
      setBody(a.body || '');
      setImage(a.image || '');
      setLinkUrl(a.linkUrl || '');
      setLinkText(a.linkText || '');
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
    const data = { title, date, body, image, linkUrl, linkText };

    if (currentEditId) {
      await updateDocument('achievements', currentEditId, data);
    } else {
      await addDocument('achievements', data);
    }
    
    handleCloseModal();
    fetchAchievements();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this achievement?")) {
      await deleteDocument('achievements', id);
      fetchAchievements();
    }
  };

  return (
    <div>
      <div className={styles.cardHeader}>
        <h2>Manage Achievements</h2>
        <button className={styles.btnPrimary} onClick={() => handleOpenModal()}>+ Add Achievement</button>
      </div>

      <div className={styles.card}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Date</th>
                <th>Title</th>
                <th>Body Preview</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {achievements.map((a) => (
                <tr key={a.id}>
                  <td>
                    {a.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={a.image} alt={a.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '4px' }} />
                    )}
                  </td>
                  <td>{a.date}</td>
                  <td>{a.title}</td>
                  <td>{a.body.substring(0, 50)}...</td>
                  <td className={styles.actions}>
                    <button className={styles.btnEdit} onClick={() => handleOpenModal(a)}>Edit</button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(a.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {achievements.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center' }}>No achievements found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{currentEditId ? 'Edit Achievement' : 'Add Achievement'}</h2>
            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Date of Achievement</label>
                <input type="date" required value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Body</label>
                <textarea 
                  required
                  value={body} 
                  onChange={e => setBody(e.target.value)} 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  rows={4}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Link URL (Optional - PDF or external link)</label>
                <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div className={styles.formGroup}>
                <label>Link Text (Optional)</label>
                <input value={linkText} onChange={e => setLinkText(e.target.value)} placeholder="View PDF / Read More" />
              </div>
              <div className={styles.formGroup}>
                <label>Image (Optional)</label>
                <ImageUpload folder="achievements" currentImageUrl={image} onUploadSuccess={url => setImage(url)} />
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
