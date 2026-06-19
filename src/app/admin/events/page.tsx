"use client";

import { useEffect, useState } from 'react';
import { getDocuments, addDocument, updateDocument, deleteDocument } from '../../../services/firebaseCrud';
import ImageUpload from '../../../components/admin/ImageUpload';
import styles from '../admin.module.css';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [image, setImage] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    const data = await getDocuments('events');
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setVenue('');
    setImage('');
    setCurrentEditId(null);
  };

  const handleOpenModal = (ev?: any) => {
    if (ev) {
      setTitle(ev.title || '');
      setDescription(ev.description || '');
      setDate(ev.date || '');
      setVenue(ev.venue || '');
      setImage(ev.image || '');
      setCurrentEditId(ev.id);
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
    const data = { title, description, date, venue, image };

    if (currentEditId) {
      await updateDocument('events', currentEditId, data);
    } else {
      await addDocument('events', data);
    }
    
    handleCloseModal();
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      await deleteDocument('events', id);
      fetchEvents();
    }
  };

  return (
    <div>
      <div className={styles.cardHeader}>
        <h2>Manage Events</h2>
        <button className={styles.btnPrimary} onClick={() => handleOpenModal()}>+ Add Event</button>
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
                <th>Date</th>
                <th>Venue</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td>
                    {ev.image ? (
                      <img src={ev.image} alt={ev.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '4px' }} />
                    )}
                  </td>
                  <td>{ev.title}</td>
                  <td>{ev.date}</td>
                  <td>{ev.venue}</td>
                  <td className={styles.actions}>
                    <button className={styles.btnEdit} onClick={() => handleOpenModal(ev)}>Edit</button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(ev.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center' }}>No events found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{currentEditId ? 'Edit Event' : 'Add Event'}</h2>
            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Date</label>
                <input required type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Venue</label>
                <input value={venue} onChange={e => setVenue(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  rows={4}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Image</label>
                <ImageUpload folder="events" currentImageUrl={image} onUploadSuccess={url => setImage(url)} />
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
