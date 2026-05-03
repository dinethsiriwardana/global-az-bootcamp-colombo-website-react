import React, { useState } from "react";
import { organizingCommittee, CommitteeMember } from "../../data/organizingCommittee";
import "./OrganizingCommittee.scss";

const OrganizingCommittee: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="organizing-committee" className="organizing-committee-section">
      <div className="container-fluid" data-aos="fade-up">
        <div className="section-header">
          <h2>Organizing Committee</h2>
          <p>Meet the Team Behind Global Azure 2026</p>
        </div>
        <div className="hexagon-gallery">
          {organizingCommittee.map((member: CommitteeMember) => (
            <div
              key={member.id}
              className={`hex ${hoveredId === member.id ? "hovered" : ""}`}
              onMouseEnter={() => setHoveredId(member.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <img src={member.profilePicture} alt={member.fullName} />
              <div className="hex-overlay">
                <h3>{member.fullName}</h3>
                <p>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrganizingCommittee;