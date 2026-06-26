"use client";

import { useEffect, useState } from 'react';
import { getDocuments, addDocument, updateDocument, deleteDocument } from '../../../services/firebaseCrud';
import ImageUpload from '../../../components/admin/ImageUpload';
import styles from '../admin.module.css';

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const fetchNews = async () => {
    setLoading(true);
    const data = await getDocuments('news');
    setNews(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const resetForm = () => {
    setTitle('');
    setBody('');
    setImage('');
    setLinkUrl('');
    setLinkText('');
    setCurrentEditId(null);
  };

  const handleOpenModal = (n?: any) => {
    if (n) {
      setTitle(n.title || '');
      setBody(n.body || '');
      setImage(n.image || '');
      setLinkUrl(n.linkUrl || '');
      setLinkText(n.linkText || '');
      setCurrentEditId(n.id);
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
    const data = { title, body, image, linkUrl, linkText };

    if (currentEditId) {
      await updateDocument('news', currentEditId, data);
    } else {
      await addDocument('news', data);
    }
    
    handleCloseModal();
    fetchNews();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this news item?")) {
      await deleteDocument('news', id);
      fetchNews();
    }
  };

  return (
    <div>
      <div className={styles.cardHeader}>
        <h2>Manage News & Notices</h2>
        <button className={styles.btnPrimary} onClick={() => handleOpenModal()}>+ Add News</button>
      </div>

      <div className={styles.card}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Body Preview</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {news.map((n) => (
                <tr key={n.id}>
                  <td>
                    {n.image ? (
                      <img src={n.image} alt={n.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '4px' }} />
                    )}
                  </td>
                  <td>{n.title}</td>
                  <td>{n.body.substring(0, 50)}...</td>
                  <td className={styles.actions}>
                    <button className={styles.btnEdit} onClick={() => handleOpenModal(n)}>Edit</button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(n.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {news.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center' }}>No news found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{currentEditId ? 'Edit News' : 'Add News'}</h2>
            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} />
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
                <label>Link URL (Optional)</label>
                <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div className={styles.formGroup}>
                <label>Link Text (Optional)</label>
                <input value={linkText} onChange={e => setLinkText(e.target.value)} placeholder="Read More" />
              </div>
              <div className={styles.formGroup}>
                <label>Image (Optional)</label>
                <ImageUpload folder="news" currentImageUrl={image} onUploadSuccess={url => setImage(url)} />
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
