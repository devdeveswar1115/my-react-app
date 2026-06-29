"use client";

import { useEffect, useState } from 'react';
import { getDocuments, addDocument, updateDocument, deleteDocument } from '../../../services/firebaseCrud';
import ImageUpload from '../../../components/admin/ImageUpload';
import styles from '../admin.module.css';

export default function CollaborationsPage() {
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  // Form State
  const [institution, setInstitution] = useState('');
  const [investigator, setInvestigator] = useState('');
  const [project, setProject] = useState('');
  const [logo, setLogo] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const fetchCollaborations = async () => {
    setLoading(true);
    const data = await getDocuments('collaborations');
    setCollaborations(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const resetForm = () => {
    setInstitution('');
    setInvestigator('');
    setProject('');
    setLogo('');
    setLinkUrl('');
    setCurrentEditId(null);
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setInstitution(item.institution || '');
      setInvestigator(item.investigator || '');
      setProject(item.project || '');
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
    const data = { institution, investigator, project, logo, linkUrl };

    if (currentEditId) {
      await updateDocument('collaborations', currentEditId, data);
    } else {
      await addDocument('collaborations', data);
    }
    
    handleCloseModal();
    fetchCollaborations();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this collaboration?")) {
      await deleteDocument('collaborations', id);
      fetchCollaborations();
    }
  };

  return (
    <div>
      <div className={styles.cardHeader}>
        <h2>Manage Research Collaborations</h2>
        <button className={styles.btnPrimary} onClick={() => handleOpenModal()}>+ Add Collaboration</button>
      </div>

      <div className={styles.card}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Institution</th>
                <th>Investigator</th>
                <th>Project</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {collaborations.map((item) => (
                <tr key={item.id}>
                  <td>{item.institution}</td>
                  <td>{item.investigator}</td>
                  <td>{item.project}</td>
                  <td className={styles.actions}>
                    <button className={styles.btnEdit} onClick={() => handleOpenModal(item)}>Edit</button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {collaborations.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center' }}>No collaborations found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{currentEditId ? 'Edit Collaboration' : 'Add Collaboration'}</h2>
            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label>Institution</label>
                <input required value={institution} onChange={e => setInstitution(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Investigator</label>
                <input value={investigator} onChange={e => setInvestigator(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Project</label>
                <input value={project} onChange={e => setProject(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Institution Logo</label>
                <ImageUpload folder="collaborations" currentImageUrl={logo} onUploadSuccess={url => setLogo(url)} />
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
