"use client";

import { useState } from "react";
import { Send, Users, FlaskConical, Target, Handshake } from "lucide-react";
import styles from "../page.module.css";

export default function CollaboratePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    interest: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await fetch("https://formspree.io/f/meewbbvb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", organization: "", interest: "", message: "" });
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
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="section-title">Collaborate With Us</h1>
        <p className="section-subtitle">
          OPEN TO TAKE-UP PHD AND M.PHARM PROJECTS
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
        
        {/* Info Section */}
        <div>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
            Our laboratory welcomes collaborative research projects from M.Pharm students, PhD scholars, academic institutions, hospitals, research organizations, and industry partners.
          </p>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
              <FlaskConical size={24} /> Projects of Interest
            </h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', lineHeight: '1.8', color: 'var(--text-main)' }}>
              <li>Drug Delivery Systems</li>
              <li>Colon-Targeted Drug Delivery</li>
              <li>Cancer Therapeutics</li>
              <li>Biomaterials & Natural Polymers</li>
              <li>Nanomedicine</li>
              <li>Pharmaceutical Formulation Development</li>
              <li>Preclinical Research</li>
              <li>Analytical Method Development</li>
              <li>Research Proposal Development</li>
            </ul>
          </div>

          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
              <Users size={24} /> Who Can Collaborate?
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {["M.Pharm Students", "PhD Scholars", "Faculty Members", "Research Institutes", "Hospitals", "Pharmaceutical Industries", "Biotechnology Startups"].map((who, idx) => (
                <span key={idx} style={{ 
                  backgroundColor: 'var(--bg-alt)', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '20px', 
                  fontSize: '0.9rem',
                  border: '1px solid var(--border)'
                }}>
                  {who}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className={styles.formCard} style={{ margin: 0, height: '100%' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Handshake size={24} /> Connect With Us
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
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
              <label className="form-label" htmlFor="email">Email Address</label>
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
              <label className="form-label" htmlFor="organization">Organization / Institution</label>
              <input
                type="text"
                id="organization"
                required
                className="form-input"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="interest">Area of Interest</label>
              <select
                id="interest"
                required
                className="form-input"
                value={formData.interest}
                onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
              >
                <option value="" disabled>Select area of interest...</option>
                <option value="Drug Delivery Systems">Drug Delivery Systems</option>
                <option value="Cancer Therapeutics">Cancer Therapeutics</option>
                <option value="Nanomedicine">Nanomedicine</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="message">Brief Proposal / Message</label>
              <textarea
                id="message"
                rows={4}
                required
                className="form-textarea"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" disabled={submitting} className={`btn btn-primary ${styles.submitBtn}`}>
              {submitting ? "Sending..." : "Submit Proposal"} <Send size={16} />
            </button>

            {submitted && (
              <div className={styles.successMessage}>
                Your request has been submitted successfully! We will get back to you soon.
              </div>
            )}
          </form>
        </div>

      </div>

      {/* Media Queries */}
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
