"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useEffect } from "react";
import { getDocuments } from "@/services/firebaseCrud";
import styles from "./page.module.css";

export default function EquipmentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [equipmentList, setEquipmentList] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDocuments('equipment');
      setEquipmentList(data);
    };
    fetchData();
  }, []);

  const filteredEquipment = equipmentList.filter(
    (eq) =>
      eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="section container">
      <h1 className="section-title">Laboratory Equipment</h1>
      <p className="section-subtitle">
        Explore our state-of-the-art facilities and machines available for research and testing.
      </p>

      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={20} />
        <input
          type="text"
          placeholder="Search by name, category, or keyword..."
          className={`form-input ${styles.searchInput}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredEquipment.length > 0 ? (
        <div className={styles.equipmentGrid}>
          {filteredEquipment.map((eq) => (
            <div key={eq.id} className={`card ${styles.equipmentCard}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={eq.image} alt={eq.name} className={styles.equipmentImage} />
              <div className={styles.equipmentContent}>
                <span className={styles.equipmentCategory}>{eq.category}</span>
                <h3 className={styles.equipmentName}>{eq.name}</h3>
                <p className={styles.equipmentDesc}>{eq.description}</p>
                <ul className={styles.specsList}>
                  {eq.specs?.map((spec: string, idx: number) => (
                    <li key={idx}>{spec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <p>No equipment found matching "{searchTerm}".</p>
          <button className="btn btn-outline" onClick={() => setSearchTerm("")} style={{ marginTop: "1rem" }}>
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}
