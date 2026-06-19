"use client";

import { useEffect, useState } from 'react';
import { getDocuments, addDocument, updateDocument, deleteDocument } from '../../../services/firebaseCrud';
import ImageUpload from '../../../components/admin/ImageUpload';
import styles from '../admin.module.css';

export default function PublicationsPage() {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [journal, setJournal] = useState('');
  const [year, setYear] = useState('');
  const [abstract, setAbstract] = useState('');
  const [image, setImage] = useState('');
  const [pdfLink, setPdfLink] = useState('');

  const fetchPublications = async () => {
    setLoading(true);
    const data = await getDocuments('publications');
    // Sort by year descending locally if not sorted by query
    setPublications(data.sort((a: any, b: any) => (b.year || 0) - (a.year || 0)));
    setLoading(false);
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const resetForm = () => {
    setTitle('');
    setAuthors('');
    setJournal('');
    setYear('');
    setAbstract('');
    setImage('');
    setPdfLink('');
    setCurrentEditId(null);
  };

  const handleOpenModal = (pub?: any) => {
    if (pub) {
      setTitle(pub.title || '');
      setAuthors(Array.isArray(pub.authors) ? pub.authors.join(', ') : (pub.authors || ''));
      setJournal(pub.journal || '');
      setYear(pub.year || '');
      setAbstract(pub.abstract || '');
      setImage(pub.image || '');
      setPdfLink(pub.pdfLink || pub.link || '');
      setCurrentEditId(pub.id);
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
    const authorsArray = authors.split(',').map(a => a.trim()).filter(a => a);
    const data = { title, authors: authorsArray, journal, year: parseInt(year) || year, abstract, image, pdfLink };

    if (currentEditId) {
      await updateDocument('publications', currentEditId, data);
    } else {
      await addDocument('publications', data);
    }
    
    handleCloseModal();
    fetchPublications();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this publication?")) {
      await deleteDocument('publications', id);
      fetchPublications();
    }
  };

  return (
    <div>
      <div className={styles.cardHeader}>
        <h2>Manage Publications</h2>
        <button className={styles.btnPrimary} onClick={() => handleOpenModal()}>+ Add Publication</button>
      </div>

      <div className={styles.card}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Year</th>
                <th>Title</th>
                <th>Journal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {publications.map((pub) => (
                <tr key={pub.id}>
                  <td>{pub.year}</td>
                  <td>{pub.title}</td>
                  <td>{pub.journal}</td>
                  <td className={styles.actions}>
                    <button className={styles.btnEdit} onClick={() => handleOpenModal(pub)}>Edit</button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(pub.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {publications.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center' }}>No publications found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{currentEditId ? 'Edit Publication' : 'Add Publication'}</h2>
            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Authors (comma separated)</label>
                <input required value={authors} onChange={e => setAuthors(e.target.value)} placeholder="John Doe, Jane Smith" />
              </div>
              <div className={styles.formGroup}>
                <label>Journal / Conference</label>
                <input required value={journal} onChange={e => setJournal(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Year</label>
                <input required type="number" value={year} onChange={e => setYear(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Abstract</label>
                <textarea 
                  value={abstract} 
                  onChange={e => setAbstract(e.target.value)} 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  rows={4}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Link / PDF Link</label>
                <input value={pdfLink} onChange={e => setPdfLink(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Cover Image (Optional)</label>
                <ImageUpload folder="publications" currentImageUrl={image} onUploadSuccess={url => setImage(url)} />
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
