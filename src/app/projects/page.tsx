import { projectsList } from "@/data/projects";
import { User, Calendar } from "lucide-react";
import styles from "./page.module.css";

export default function ProjectsPage() {
  const sortedProjects = [...projectsList].sort((a, b) => {
    if (a.status === 'ongoing' && b.status !== 'ongoing') return -1;
    if (a.status !== 'ongoing' && b.status === 'ongoing') return 1;
    return 0;
  });

  return (
    <div className="section container">
      <h1 className="section-title">Research Projects</h1>
      <p className="section-subtitle">
        Explore our active and completed research initiatives shaping the future of materials science.
      </p>

      <div className={styles.timelineContainer}>
        {sortedProjects.map((project) => (
          <div key={project.id} className={styles.projectCard}>
            <div className={styles.cardInner}>
              <div className={styles.cardContent}>
                <div className={styles.projectHeader}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <span className={`${styles.statusBadge} ${styles[`status-${project.status}`]}`}>
                    {project.status}
                  </span>
                </div>
                
                <p className={styles.projectDesc}>{project.description}</p>
                
                <div className={styles.projectMeta}>
                  <div className={styles.metaItem}>
                    <User size={14} />
                    <span>Lead: {project.lead}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Calendar size={14} />
                    <span>{project.timeline}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
