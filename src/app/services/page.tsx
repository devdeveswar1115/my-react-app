"use client";

import { useState } from "react";
import { servicesList } from "@/data/lab";
import { Send } from "lucide-react";
import styles from "./page.module.css";

export default function ServicesPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await fetch("https://formspree.io/f/mrejbllr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", service: "", message: "" });
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
      <h1 className="section-title">Testing & Analysis Services</h1>
      <p className="section-subtitle">
        We offer our state-of-the-art facilities for external academic and industrial testing.
      </p>

      <div className={styles.servicesLayout}>
        {/* Table Section */}
        <div className={styles.tableContainer}>
          <table className={styles.servicesTable}>
            <thead>
              <tr>
                <th>Instrument Name</th>
                <th>Service Type</th>
                <th>SOA</th>
                <th>University College</th>
                <th>National Lab</th>
                <th>Industry / Others</th>
              </tr>
            </thead>
            <tbody>
              {servicesList.map((service) => (
                <tr key={service.id}>
                  <td className={styles.serviceName}>{service.instrument}</td>
                  <td>{service.serviceType}</td>
                  <td className={styles.price}>{service.soa}</td>
                  <td className={styles.price}>{service.university}</td>
                  <td className={styles.price}>{service.national}</td>
                  <td className={styles.price}>{service.industry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Request Form Section */}
        <div className={styles.formCard}>
          <h3>Request Testing</h3>
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
              <label className="form-label" htmlFor="service">Service Needed</label>
              <select
                id="service"
                required
                className="form-input"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              >
                <option value="" disabled>Select a service...</option>
                {servicesList.map(s => (
                  <option key={s.id} value={s.id}>{s.instrument} - {s.serviceType}</option>
                ))}
                <option value="other">Other / Custom Request</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="message">Additional Details</label>
              <textarea
                id="message"
                rows={4}
                className="form-textarea"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" disabled={submitting} className={`btn btn-primary ${styles.submitBtn}`}>
              {submitting ? "Sending..." : "Submit Request"} <Send size={16} />
            </button>

            {submitted && (
              <div className={styles.successMessage}>
                Your request has been submitted successfully! We will contact you soon.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
