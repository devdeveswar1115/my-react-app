"use client";

import { useEffect, useState } from 'react';
import { getDocuments, addDocument, updateDocument, deleteDocument } from '../../../services/firebaseCrud';
import ImageUpload from '../../../components/admin/ImageUpload';
import styles from '../admin.module.css';

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [specs, setSpecs] = useState('');
  const [image, setImage] = useState('');

  const fetchEquipment = async () => {
    setLoading(true);
    const data = await getDocuments('equipment');
    setEquipment(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const resetForm = () => {
    setName('');
    setCategory('');
    setDescription('');
    setSpecs('');
    setImage('');
    setCurrentEditId(null);
  };

  const handleOpenModal = (eq?: any) => {
    if (eq) {
      setName(eq.name || '');
      setCategory(eq.category || '');
      setDescription(eq.description || '');
      setSpecs((eq.specs || []).join('\n'));
      setImage(eq.image || '');
      setCurrentEditId(eq.id);
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
    const specsArray = specs.split('\n').map(s => s.trim()).filter(s => s !== '');
    const data = { name, category, description, specs: specsArray, image };

    if (currentEditId) {
      await updateDocument('equipment', currentEditId, data);
    } else {
      await addDocument('equipment', data);
    }
    
    handleCloseModal();
    fetchEquipment();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this equipment?")) {
      await deleteDocument('equipment', id);
      fetchEquipment();
    }
  };

  return (
    <div>
      <div className={styles.cardHeader}>
        <h2>Manage Equipment</h2>
        <button className={styles.btnPrimary} onClick={() => handleOpenModal()}>+ Add Equipment</button>
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
                <th>Category</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((eq) => (
                <tr key={eq.id}>
                  <td>
                    {eq.image && <img src={eq.image} alt={eq.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />}
                  </td>
                  <td>{eq.name}</td>
                  <td>{eq.category}</td>
                  <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{eq.description}</td>
                  <td className={styles.actions}>
                    <button className={styles.btnEdit} onClick={() => handleOpenModal(eq)}>Edit</button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(eq.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {equipment.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center' }}>No equipment found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{currentEditId ? 'Edit Equipment' : 'Add Equipment'}</h2>
            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Category</label>
                <input value={category} onChange={e => setCategory(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Specifications (One per line)</label>
                <textarea rows={4} placeholder="e.g. Resolution: 1.0 nm\nMagnification: 10x" value={specs} onChange={e => setSpecs(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Image</label>
                <ImageUpload folder="equipment" currentImageUrl={image} onUploadSuccess={url => setImage(url)} />
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
