"use client";

import { useEffect, useState } from 'react';
import { getDocuments, addDocument, updateDocument, deleteDocument } from '../../../services/firebaseCrud';
import styles from '../admin.module.css';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  // Form State
  const [instrument, setInstrument] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [soa, setSoa] = useState('');
  const [university, setUniversity] = useState('');
  const [national, setNational] = useState('');
  const [industry, setIndustry] = useState('');

  const fetchServices = async () => {
    setLoading(true);
    const data = await getDocuments('services');
    setServices(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const resetForm = () => {
    setInstrument('');
    setServiceType('');
    setSoa('');
    setUniversity('');
    setNational('');
    setIndustry('');
    setCurrentEditId(null);
  };

  const handleOpenModal = (srv?: any) => {
    if (srv) {
      setInstrument(srv.instrument || '');
      setServiceType(srv.serviceType || '');
      setSoa(srv.soa || '');
      setUniversity(srv.university || '');
      setNational(srv.national || '');
      setIndustry(srv.industry || '');
      setCurrentEditId(srv.id);
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
    const data = { instrument, serviceType, soa, university, national, industry };

    if (currentEditId) {
      await updateDocument('services', currentEditId, data);
    } else {
      await addDocument('services', data);
    }
    
    handleCloseModal();
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      await deleteDocument('services', id);
      fetchServices();
    }
  };

  return (
    <div>
      <div className={styles.cardHeader}>
        <h2>Manage Services</h2>
        <button className={styles.btnPrimary} onClick={() => handleOpenModal()}>+ Add Service</button>
      </div>

      <div className={styles.card}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Instrument Name</th>
                <th>Service Type</th>
                <th>SOA Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((srv) => (
                <tr key={srv.id}>
                  <td>{srv.instrument}</td>
                  <td>{srv.serviceType}</td>
                  <td>{srv.soa}</td>
                  <td className={styles.actions}>
                    <button className={styles.btnEdit} onClick={() => handleOpenModal(srv)}>Edit</button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(srv.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center' }}>No services found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '600px' }}>
            <h2>{currentEditId ? 'Edit Service' : 'Add Service'}</h2>
            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label>Instrument Name</label>
                <input required value={instrument} onChange={e => setInstrument(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Service Type</label>
                <input required value={serviceType} onChange={e => setServiceType(e.target.value)} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label>SOA Price</label>
                  <input value={soa} onChange={e => setSoa(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>University College Price</label>
                  <input value={university} onChange={e => setUniversity(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label>National Lab Price</label>
                  <input value={national} onChange={e => setNational(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>Industry Price</label>
                  <input value={industry} onChange={e => setIndustry(e.target.value)} />
                </div>
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
