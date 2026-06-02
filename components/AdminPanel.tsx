'use client';

import React, { useState } from 'react';
import { Portal, Website } from '@/types/portal';
import Modal from './Modal';
import { showToast } from './Toast';

interface AdminPanelProps {
  portals: Portal[];
  websites: Website[];
  teams: string[];
  isAuthenticated: boolean;
  onLogout: () => void;
  onUpdate: (portals: Portal[], websites: Website[], teams: string[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  portals,
  websites,
  teams,
  isAuthenticated,
  onLogout,
  onUpdate,
}) => {
  const [activeTab, setActiveTab] = useState('portals');
  const [showPortalModal, setShowPortalModal] = useState(false);
  const [showWebsiteModal, setShowWebsiteModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingPortal, setEditingPortal] = useState<Portal | null>(null);
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);
  const [editTeams, setEditTeams] = useState<string[]>([]);
  const [editingTeamName, setEditingTeamName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Portal form
  const [portalForm, setPortalForm] = useState<{
    code: string;
    name: string;
    url: string;
    portalType: 'Private' | 'Public' | 'Restricted';
    users: number;
    about: string;
    trainingPdf: string;
  }>({
    code: '',
    name: '',
    url: '',
    portalType: 'Private',
    users: 0,
    about: '',
    trainingPdf: '',
  });

  // Website form
  const [websiteForm, setWebsiteForm] = useState({
    code: '',
    name: '',
    url: '',
    about: '',
  });

  const handlePortalSave = async () => {
    if (!portalForm.code || !portalForm.name || !portalForm.url) {
      showToast('Kod, isim ve URL zorunludur', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const portalId = editingPortal ? editingPortal.id : (portalForm.code + Date.now());
      const portalData: Portal = {
        id: portalId,
        ...portalForm,
        teams: editTeams,
      };

      const res = await fetch('/api/portals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portalData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Portal kaydedilemedi.');
      }

      let updatedPortals = [...portals];
      if (editingPortal) {
        updatedPortals = updatedPortals.map((p) =>
          p.id === editingPortal.id ? portalData : p
        );
      } else {
        updatedPortals.push(portalData);
      }

      onUpdate(updatedPortals, websites, teams);
      setShowPortalModal(false);
      resetPortalForm();
      showToast(editingPortal ? 'Portal güncellendi' : 'Portal eklendi', 'success');
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'Bir hata oluştu.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWebsiteSave = async () => {
    if (!websiteForm.code || !websiteForm.name || !websiteForm.url) {
      showToast('Kod, isim ve URL zorunludur', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const websiteId = editingWebsite ? editingWebsite.id : (websiteForm.code + Date.now());
      const websiteData: Website = {
        id: websiteId,
        ...websiteForm,
      };

      const res = await fetch('/api/websites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(websiteData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Site kaydedilemedi.');
      }

      let updatedWebsites = [...websites];
      if (editingWebsite) {
        updatedWebsites = updatedWebsites.map((w) =>
          w.id === editingWebsite.id ? websiteData : w
        );
      } else {
        updatedWebsites.push(websiteData);
      }

      onUpdate(portals, updatedWebsites, teams);
      setShowWebsiteModal(false);
      resetWebsiteForm();
      showToast(editingWebsite ? 'Site güncellendi' : 'Site eklendi', 'success');
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'Bir hata oluştu.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTeamSave = async () => {
    if (!editingTeamName.trim()) {
      showToast('Ekip adı zorunludur', 'error');
      return;
    }

    const newTeamName = editingTeamName.trim().toUpperCase();
    if (teams.includes(newTeamName)) {
      showToast('Bu ekip zaten mevcut', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTeamName }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Ekip kaydedilemedi.');
      }

      const updatedTeams = [...teams, newTeamName].sort();
      onUpdate(portals, websites, updatedTeams);
      setShowTeamModal(false);
      setEditingTeamName('');
      showToast('Ekip eklendi', 'success');
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'Bir hata oluştu.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePortal = async (id: string) => {
    if (!confirm('Bu portalı silmek istediğinizden emin misiniz?')) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/portals/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Portal silinemedi.');
      }

      const updatedPortals = portals.filter((p) => p.id !== id);
      onUpdate(updatedPortals, websites, teams);
      showToast('Portal silindi', 'success');
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'Bir hata oluştu.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWebsite = async (id: string) => {
    if (!confirm('Bu siteyi silmek istediğinizden emin misiniz?')) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/websites/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Site silinemedi.');
      }

      const updatedWebsites = websites.filter((w) => w.id !== id);
      onUpdate(portals, updatedWebsites, teams);
      showToast('Site silindi', 'success');
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'Bir hata oluştu.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeam = async (teamName: string) => {
    if (!confirm(`"${teamName}" ekibini silmek istediğinizden emin misiniz?`))
      return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/teams/${encodeURIComponent(teamName)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Ekip silinemedi.');
      }

      const updatedTeams = teams.filter((t) => t !== teamName);
      // Also update portals arrays locally since they were updated on backend
      const updatedPortals = portals.map((p) => ({
        ...p,
        teams: p.teams.filter((t) => t !== teamName),
      }));

      onUpdate(updatedPortals, websites, updatedTeams);
      showToast('Ekip silindi', 'success');
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'Bir hata oluştu.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openPortalModal = (portal?: Portal) => {
    if (portal) {
      setEditingPortal(portal);
      setPortalForm({
        code: portal.code,
        name: portal.name,
        url: portal.url,
        portalType: portal.portalType,
        users: portal.users,
        about: portal.about,
        trainingPdf: portal.trainingPdf || '',
      });
      setEditTeams([...portal.teams]);
    } else {
      resetPortalForm();
    }
    setShowPortalModal(true);
  };

  const openWebsiteModal = (website?: Website) => {
    if (website) {
      setEditingWebsite(website);
      setWebsiteForm({
        code: website.code,
        name: website.name,
        url: website.url,
        about: website.about,
      });
    } else {
      resetWebsiteForm();
    }
    setShowWebsiteModal(true);
  };

  const resetPortalForm = () => {
    setEditingPortal(null);
    setPortalForm({
      code: '',
      name: '',
      url: '',
      portalType: 'Private',
      users: 0,
      about: '',
      trainingPdf: '',
    });
    setEditTeams([]);
  };

  const resetWebsiteForm = () => {
    setEditingWebsite(null);
    setWebsiteForm({
      code: '',
      name: '',
      url: '',
      about: '',
    });
  };

  if (!isAuthenticated) return null;

  const teamCounts: Record<string, number> = {};
  portals.forEach((p) => {
    p.teams.forEach((t) => {
      teamCounts[t] = (teamCounts[t] || 0) + 1;
    });
  });

  return (
    <div className="adw">
      <div className="adhd">
        <div>
          <div className="adhd-t">Admin Paneli</div>
          <div className="adhd-s">Portal, web sitesi ve ekipleri yönetin</div>
        </div>
        <button className="btn btn-s btn-sm" onClick={onLogout} disabled={isSubmitting}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Çıkış Yap
        </button>
      </div>

      {/* Tabs */}
      <div className="atabs">
        <button
          className={`atab ${activeTab === 'portals' ? 'active' : ''}`}
          onClick={() => setActiveTab('portals')}
          disabled={isSubmitting}
        >
          Portallar
        </button>
        <button
          className={`atab ${activeTab === 'websites' ? 'active' : ''}`}
          onClick={() => setActiveTab('websites')}
          disabled={isSubmitting}
        >
          Web Siteleri
        </button>
        <button
          className={`atab ${activeTab === 'teams' ? 'active' : ''}`}
          onClick={() => setActiveTab('teams')}
          disabled={isSubmitting}
        >
          Ekipler
        </button>
      </div>

      {/* Portals Tab */}
      {activeTab === 'portals' && (
        <div className="asec active">
          <div className="tcard">
            <div className="thead">
              <div className="thead-t">Tüm Portallar</div>
              <button
                className="btn btn-p btn-sm"
                onClick={() => openPortalModal()}
                disabled={isSubmitting}
              >
                + Portal Ekle
              </button>
            </div>
            <div className="tscroll">
              <table>
                <thead>
                  <tr>
                    <th>Kod</th>
                    <th>İsim</th>
                    <th>URL</th>
                    <th>Tip</th>
                    <th>Kullanıcı</th>
                    <th>Ekipler</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {portals.length > 0 ? (
                    portals.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <span className="tdc">{p.code}</span>
                        </td>
                        <td className="tdn">{p.name}</td>
                        <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--brand)', fontSize: '11px' }}
                          >
                            {p.url.replace('https://', '').substring(0, 35)}
                          </a>
                        </td>
                        <td>
                          <span className="cbg cbg-p">{p.portalType}</span>
                        </td>
                        <td>{p.users || 0}</td>
                        <td style={{ maxWidth: '180px' }}>
                          {p.teams.map((t) => (
                            <span
                              key={t}
                              style={{
                                fontSize: '10px',
                                background: 'var(--s2)',
                                padding: '1px 5px',
                                borderRadius: '3px',
                                margin: '1px',
                                display: 'inline-block',
                                whiteSpace: 'nowrap',
                                border: '1px solid var(--l1)',
                              }}
                            >
                              {t}
                            </span>
                          ))}
                        </td>
                        <td>
                          <div className="tda">
                            <button
                              className="btn btn-s btn-sm"
                              onClick={() => openPortalModal(p)}
                              disabled={isSubmitting}
                            >
                              Düzenle
                            </button>
                            <button
                              className="btn btn-d btn-sm"
                              onClick={() => handleDeletePortal(p.id)}
                              disabled={isSubmitting}
                            >
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', color: 'var(--t3)', padding: '24px' }}>
                        Portal yok
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Websites Tab */}
      {activeTab === 'websites' && (
        <div className="asec active">
          <div className="tcard">
            <div className="thead">
              <div className="thead-t">Web Siteleri</div>
              <button
                className="btn btn-p btn-sm"
                onClick={() => openWebsiteModal()}
                disabled={isSubmitting}
              >
                + Site Ekle
              </button>
            </div>
            <div className="tscroll">
              <table>
                <thead>
                  <tr>
                    <th>Kod</th>
                    <th>İsim</th>
                    <th>URL</th>
                    <th>Açıklama</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {websites.length > 0 ? (
                    websites.map((w) => (
                      <tr key={w.id}>
                        <td>
                          <span className="tdc">{w.code}</span>
                        </td>
                        <td className="tdn">{w.name}</td>
                        <td style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <a
                            href={w.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--brand)', fontSize: '11px' }}
                          >
                            {w.url.replace(/^https?:\/\//, '').substring(0, 30)}
                          </a>
                        </td>
                        <td style={{ maxWidth: '150px', fontSize: '12px' }}>
                          {w.about?.substring(0, 45)}
                          {w.about && w.about.length > 45 ? '…' : ''}
                        </td>
                        <td>
                          <div className="tda">
                            <button
                              className="btn btn-s btn-sm"
                              onClick={() => openWebsiteModal(w)}
                              disabled={isSubmitting}
                            >
                              Düzenle
                            </button>
                            <button
                              className="btn btn-d btn-sm"
                              onClick={() => handleDeleteWebsite(w.id)}
                              disabled={isSubmitting}
                            >
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: 'var(--t3)', padding: '24px' }}>
                        Site yok
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Teams Tab */}
      {activeTab === 'teams' && (
        <div className="asec active">
          <div className="tcard">
            <div className="thead">
              <div className="thead-t">Ekipler</div>
              <button
                className="btn btn-p btn-sm"
                onClick={() => setShowTeamModal(true)}
                disabled={isSubmitting}
              >
                + Ekip Ekle
              </button>
            </div>
            <div className="tscroll">
              <table>
                <thead>
                  <tr>
                    <th>Ekip Adı</th>
                    <th>Portal Sayısı</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.length > 0 ? (
                    teams.map((t) => (
                      <tr key={t}>
                        <td className="tdn">{t}</td>
                        <td>{teamCounts[t] || 0} portal</td>
                        <td>
                          <button
                            className="btn btn-d btn-sm"
                            onClick={() => handleDeleteTeam(t)}
                            disabled={isSubmitting}
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'center', color: 'var(--t3)', padding: '24px' }}>
                        Ekip yok
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Portal Modal */}
      <Modal
        id="portalModal"
        isOpen={showPortalModal}
        title={editingPortal ? 'Portalı Düzenle' : 'Yeni Portal Ekle'}
        subtitle="Portal bilgilerini doldurun"
        onClose={() => setShowPortalModal(false)}
        onConfirm={handlePortalSave}
        confirmText={isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
        isLoading={isSubmitting}
      >
        <div className="fg">
          <label className="fl">Kod *</label>
          <input
            type="text"
            className="fi"
            placeholder="Örn: ZANL"
            value={portalForm.code}
            onChange={(e) => setPortalForm({ ...portalForm, code: e.target.value })}
            disabled={isSubmitting}
          />
        </div>
        <div className="fg">
          <label className="fl">İsim *</label>
          <input
            type="text"
            className="fi"
            placeholder="Örn: Zoho Analytics"
            value={portalForm.name}
            onChange={(e) => setPortalForm({ ...portalForm, name: e.target.value })}
            disabled={isSubmitting}
          />
        </div>
        <div className="fg">
          <label className="fl">URL *</label>
          <input
            type="text"
            className="fi"
            placeholder="https://…"
            value={portalForm.url}
            onChange={(e) => setPortalForm({ ...portalForm, url: e.target.value })}
            disabled={isSubmitting}
          />
        </div>
        <div className="fg">
          <label className="fl">Erişim Tipi</label>
          <select
            className="fsel"
            value={portalForm.portalType}
            onChange={(e) =>
              setPortalForm({
                ...portalForm,
                portalType: e.target.value as 'Private' | 'Public' | 'Restricted',
              })
            }
            disabled={isSubmitting}
          >
            <option>Private</option>
            <option>Public</option>
            <option>Restricted</option>
          </select>
        </div>
        <div className="fg">
          <label className="fl">Kullanıcı Sayısı</label>
          <input
            type="number"
            className="fi"
            placeholder="0"
            min="0"
            value={portalForm.users}
            onChange={(e) =>
              setPortalForm({ ...portalForm, users: parseInt(e.target.value) || 0 })
            }
            disabled={isSubmitting}
          />
        </div>
        <div className="fg">
          <label className="fl">Açıklama</label>
          <textarea
            className="fta"
            placeholder="Portal hakkında kısa açıklama…"
            value={portalForm.about}
            onChange={(e) => setPortalForm({ ...portalForm, about: e.target.value })}
            disabled={isSubmitting}
          />
        </div>
        <div className="fg">
          <label className="fl">Eğitim PDF URL</label>
          <input
            type="text"
            className="fi"
            placeholder="Örn: /pdf/DOSYA ADI.pdf veya https://..."
            value={portalForm.trainingPdf}
            onChange={(e) => setPortalForm({ ...portalForm, trainingPdf: e.target.value })}
            disabled={isSubmitting}
          />
        </div>
        <div className="fg" style={{ marginTop: '10px' }}>
          <label className="fl">Ekipler</label>
          <div className="team-checkboxes-container">
            {teams.length > 0 ? (
              teams.map((team) => (
                <label key={team} className="team-checkbox-label">
                  <input
                    type="checkbox"
                    checked={editTeams.includes(team)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setEditTeams([...editTeams, team]);
                      } else {
                        setEditTeams(editTeams.filter((t) => t !== team));
                      }
                    }}
                    disabled={isSubmitting}
                  />
                  <span className="team-checkbox-text">{team}</span>
                </label>
              ))
            ) : (
              <span style={{ fontSize: '11px', color: 'var(--t3)' }}>
                Henüz ekip bulunmuyor.
              </span>
            )}
          </div>
        </div>
      </Modal>

      {/* Website Modal */}
      <Modal
        id="websiteModal"
        isOpen={showWebsiteModal}
        title={editingWebsite ? 'Siteyi Düzenle' : 'Yeni Web Sitesi Ekle'}
        subtitle="Site bilgilerini doldurun"
        onClose={() => setShowWebsiteModal(false)}
        onConfirm={handleWebsiteSave}
        confirmText={isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
        isLoading={isSubmitting}
      >
        <div className="fg">
          <label className="fl">Kod *</label>
          <input
            type="text"
            className="fi"
            value={websiteForm.code}
            onChange={(e) => setWebsiteForm({ ...websiteForm, code: e.target.value })}
            disabled={isSubmitting}
          />
        </div>
        <div className="fg">
          <label className="fl">İsim *</label>
          <input
            type="text"
            className="fi"
            value={websiteForm.name}
            onChange={(e) => setWebsiteForm({ ...websiteForm, name: e.target.value })}
            disabled={isSubmitting}
          />
        </div>
        <div className="fg">
          <label className="fl">URL *</label>
          <input
            type="text"
            className="fi"
            placeholder="https://…"
            value={websiteForm.url}
            onChange={(e) => setWebsiteForm({ ...websiteForm, url: e.target.value })}
            disabled={isSubmitting}
          />
        </div>
        <div className="fg">
          <label className="fl">Açıklama</label>
          <textarea
            className="fta"
            value={websiteForm.about}
            onChange={(e) => setWebsiteForm({ ...websiteForm, about: e.target.value })}
            disabled={isSubmitting}
          />
        </div>
      </Modal>

      {/* Team Modal */}
      <Modal
        id="teamModal"
        isOpen={showTeamModal}
        title="Yeni Ekip Ekle"
        subtitle="Ekip adını girin"
        onClose={() => {
          setShowTeamModal(false);
          setEditingTeamName('');
        }}
        onConfirm={handleTeamSave}
        confirmText={isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
        isLoading={isSubmitting}
      >
        <div className="fg">
          <label className="fl">Ekip Adı *</label>
          <input
            type="text"
            className="fi"
            placeholder="Örn: YENİ EKİBİ"
            value={editingTeamName}
            onChange={(e) => setEditingTeamName(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </Modal>
    </div>
  );
};

export default AdminPanel;
