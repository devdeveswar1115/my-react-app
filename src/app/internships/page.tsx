"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { getDocuments } from "@/services/firebaseCrud";
import styles from "./page.module.css";

export default function InternshipsPage() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    institute: "",
    interestedField: "",
    dateFrom: "",
    dateTo: "",
    details: ""
  });
  
  const [fieldsList, setFieldsList] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchFields = async () => {
      const data = await getDocuments('internshipFields');
      // Pre-populate if database is empty for demo purposes as per implementation plan fallback
      if (data.length === 0) {
        setFieldsList([
          { id: '1', name: 'Cell culture' },
          { id: '2', name: 'HET CAM' },
          { id: '3', name: 'Microbiology' },
          { id: '4', name: 'Analytical equipments' }
        ]);
      } else {
        setFieldsList(data);
      }
    };
    fetchFields();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Using the same formspree endpoint, but could be configured otherwise
      const response = await fetch("https://formspree.io/f/mlgkyyaz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...formData, type: "Internship Request" })
      });
      
      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: "", mobile: "", email: "", institute: "",
          interestedField: "", dateFrom: "", dateTo: "", details: ""
        });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert("Oops! There was a problem submitting your form.");
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section container">
      <h1 className="section-title">Internship & Training Program</h1>
      <p className="section-subtitle">
        Apply for hands-on experience and training in our state-of-the-art laboratory facilities.
      </p>

      <div className={styles.formContainer}>
        <div className={styles.formCard}>
          <h3>Application Query Form</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="mobile">Mobile Number</label>
                <input
                  type="tel"
                  id="mobile"
                  required
                  className="form-input"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Contact Email ID</label>
              <input
                type="email"
                id="email"
                required
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="institute">Institute and University Name</label>
              <input
                type="text"
                id="institute"
                required
                className="form-input"
                value={formData.institute}
                onChange={(e) => setFormData({ ...formData, institute: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="interestedField">Interested Field</label>
              <select
                id="interestedField"
                required
                className="form-input"
                value={formData.interestedField}
                onChange={(e) => setFormData({ ...formData, interestedField: e.target.value })}
              >
                <option value="" disabled>Select a field...</option>
                {fieldsList.map(f => (
                  <option key={f.id} value={f.name}>{f.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="dateFrom">Internship Period (From)</label>
                <input
                  type="date"
                  id="dateFrom"
                  required
                  className="form-input"
                  value={formData.dateFrom}
                  onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="dateTo">Internship Period (To)</label>
                <input
                  type="date"
                  id="dateTo"
                  required
                  className="form-input"
                  value={formData.dateTo}
                  onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="details">Additional Details</label>
              <textarea
                id="details"
                rows={4}
                className="form-textarea"
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" disabled={submitting} className={`btn btn-primary ${styles.submitBtn}`}>
              {submitting ? "Submitting..." : "Submit Application"} <Send size={16} />
            </button>

            {submitted && (
              <div className={styles.successMessage}>
                Your application has been submitted successfully! We will contact you soon.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
