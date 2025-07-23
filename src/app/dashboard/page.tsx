'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type ServiceTemplate = {
  id: number;
  title: string;
  description: string;
  type: string;
};

type UserIntegration = {
  template_id: number;
  status: string;
  credentials: any;
  created_at: string;
  updated_at: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [serviceTemplates, setServiceTemplates] = useState<ServiceTemplate[]>([]);
  const [userIntegrations, setUserIntegrations] = useState<UserIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // 1. Servis şablonlarını çek
        const templatesRes = await fetch(
          'https://apiprodv2.entekas.com/api/v1/customer/service-templates?type=ecommerce',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: 'application/json',
            },
          }
        );
        const templatesData = await templatesRes.json();
        console.log("templatesData", templatesData);
        if (!templatesRes.ok) throw new Error(templatesData.message || 'Servis şablonları alınamadı');
        setServiceTemplates(
          Array.isArray(templatesData.data?.data) ? templatesData.data.data : []
        );

        // 2. Kullanıcı entegrasyonlarını çek
        const integrationsRes = await fetch(
          'https://apiprodv2.entekas.com/api/v1/customer/user-integrations',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: 'application/json',
            },
          }
        );
        const integrationsData = await integrationsRes.json();
        console.log("integrationsData", integrationsData);
        if (!integrationsRes.ok) throw new Error(integrationsData.message || 'Entegrasyonlar alınamadı');
        setUserIntegrations(
          Array.isArray(integrationsData.data?.data) ? integrationsData.data.data : []
        );
      } catch (err: any) {
        setError(err.message || 'Veriler alınamadı');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Eşleştirme
  const merged = serviceTemplates.map((template) => {
    const integration = userIntegrations.find((i) => i.template_id === template.id);
    return {
      ...template,
      status: integration ? integration.status : 'Henüz bağlantı yapılmadı',
    };
  });

  if (loading) return <div style={{ textAlign: 'center', marginTop: 60 }}>Yükleniyor...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 60 }}>{error}</div>;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 32 }}>Servis Şablonları ve Entegrasyonlar</h2>
      {merged.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888' }}>Hiç servis şablonu bulunamadı.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {merged.map((item) => (
            <li
              key={item.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                marginBottom: 18,
                padding: 18,
                background: '#f9fafb',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 18 }}>{item.title}</div>
              <div style={{ color: '#4a5568', margin: '8px 0 12px 0' }}>{item.description}</div>
              <div>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: 8,
                    background: item.status === 'connected' ? '#c6f6d5' : '#fed7d7',
                    color: item.status === 'connected' ? '#22543d' : '#822727',
                    fontWeight: 500,
                  }}
                >
                  {item.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
