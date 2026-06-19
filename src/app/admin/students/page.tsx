"use client";

import { useEffect, useState } from 'react';
import { getDocuments, addDocument, updateDocument, deleteDocument } from '../../../services/firebaseCrud';
import ImageUpload from '../../../components/admin/ImageUpload';
import styles from '../admin.module.css';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [year, setYear] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    const data = await getDocuments('phd_students');
    setStudents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const resetForm = () => {
    setName('');
    setTopic('');
    setYear('');
    setEmail('');
    setImage('');
    setCurrentEditId(null);
  };

  const handleOpenModal = (stu?: any) => {
    if (stu) {
      setName(stu.name || '');
      setTopic(stu.topic || '');
      setYear(stu.year || '');
      setEmail(stu.email || '');
      setImage(stu.image || '');
      setCurrentEditId(stu.id);
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
    const data = { name, topic, year, email, image };

    if (currentEditId) {
      await updateDocument('phd_students', currentEditId, data);
    } else {
      await addDocument('phd_students', data);
    }
    
    handleCloseModal();
    fetchStudents();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      await deleteDocument('phd_students', id);
      fetchStudents();
    }
  };

  return (
    <div>
      <div className={styles.cardHeader}>
        <h2>Manage PhD Students</h2>
        <button className={styles.btnPrimary} onClick={() => handleOpenModal()}>+ Add Student</button>
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
                <th>Research Topic</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((stu) => (
                <tr key={stu.id}>
                  <td>
                    {stu.image && <img src={stu.image} alt={stu.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />}
                  </td>
                  <td>{stu.name}</td>
                  <td>{stu.topic}</td>
                  <td>{stu.year}</td>
                  <td className={styles.actions}>
                    <button className={styles.btnEdit} onClick={() => handleOpenModal(stu)}>Edit</button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(stu.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center' }}>No students found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{currentEditId ? 'Edit Student' : 'Add Student'}</h2>
            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Research Topic</label>
                <input value={topic} onChange={e => setTopic(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Year / Timeline</label>
                <input value={year} onChange={e => setYear(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Image</label>
                <ImageUpload folder="students" currentImageUrl={image} onUploadSuccess={url => setImage(url)} />
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
