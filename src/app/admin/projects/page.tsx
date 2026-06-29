"use client";

import { useEffect, useState } from 'react';
import { getDocuments, addDocument, updateDocument, deleteDocument } from '../../../services/firebaseCrud';
import ImageUpload from '../../../components/admin/ImageUpload';
import styles from '../admin.module.css';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('ongoing');
  const [image, setImage] = useState('');
  const [facultyLead, setFacultyLead] = useState('');
  const [fundingAgency, setFundingAgency] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    const data = await getDocuments('projects');
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('ongoing');
    setImage('');
    setFacultyLead('');
    setFundingAgency('');
    setLinkUrl('');
    setCurrentEditId(null);
  };

  const handleOpenModal = (proj?: any) => {
    if (proj) {
      setTitle(proj.title || '');
      setDescription(proj.description || '');
      setStatus(proj.status || 'ongoing');
      setImage(proj.image || '');
      setFacultyLead(proj.facultyLead || proj.lead || '');
      setFundingAgency(proj.fundingAgency || '');
      setLinkUrl(proj.linkUrl || '');
      setCurrentEditId(proj.id);
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
    const data = { title, description, status, image, facultyLead, fundingAgency, linkUrl };

    if (currentEditId) {
      await updateDocument('projects', currentEditId, data);
    } else {
      await addDocument('projects', data);
    }
    
    handleCloseModal();
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await deleteDocument('projects', id);
      fetchProjects();
    }
  };

  return (
    <div>
      <div className={styles.cardHeader}>
        <h2>Manage Projects</h2>
        <button className={styles.btnPrimary} onClick={() => handleOpenModal()}>+ Add Project</button>
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
                <th>Status</th>
                <th>Lead</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr key={proj.id}>
                  <td>
                    {proj.image ? (
                      <img src={proj.image} alt="Project" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '4px' }} />
                    )}
                  </td>
                  <td>{proj.title}</td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.875rem',
                      background: proj.status === 'completed' ? '#dcfce7' : '#fef08a',
                      color: proj.status === 'completed' ? '#166534' : '#854d0e'
                    }}>
                      {proj.status}
                    </span>
                  </td>
                  <td>{proj.facultyLead || proj.lead}</td>
                  <td className={styles.actions}>
                    <button className={styles.btnEdit} onClick={() => handleOpenModal(proj)}>Edit</button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(proj.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center' }}>No projects found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{currentEditId ? 'Edit Project' : 'Add Project'}</h2>
            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Description / Details</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  rows={4}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Status</label>
                <select 
                  value={status} 
                  onChange={e => setStatus(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Faculty Lead</label>
                <input value={facultyLead} onChange={e => setFacultyLead(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Funding Agency</label>
                <input value={fundingAgency} onChange={e => setFundingAgency(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Image</label>
                <ImageUpload folder="projects" currentImageUrl={image} onUploadSuccess={url => setImage(url)} />
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
