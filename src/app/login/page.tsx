'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://apiprodv2.entekas.com/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          email_or_phone: emailOrPhone,
          password,
        }),
      });

      const data = await res.json();

      console.log("data", data);
      if (!res.ok) {
        setError(data.message || 'Giriş başarısız');
      } else {
        // Token'ı localStorage'a kaydet
        localStorage.setItem('access_token', data.data.access_token);
        console.log("token", data.data.access_token);
        // Burada yönlendirme veya başka bir işlem yapılabilir
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid = password.length >= 6;
  const isFormValid = emailOrPhone.trim() !== '' && isPasswordValid;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    }}>
      <div style={{
        width: 380,
        padding: 32,
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        background: '#fff',
        border: '1px solid #e3e3e3',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#2d3748', letterSpacing: 1 }}>Giriş Yap</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#4a5568', fontWeight: 500 }}>E-posta veya Telefon</label>
            <input
              type="text"
              placeholder="E-posta veya Telefon"
              value={emailOrPhone}
              onChange={e => setEmailOrPhone(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #cbd5e0',
                fontSize: 16,
                outline: 'none',
                transition: 'border 0.2s',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#4a5568', fontWeight: 500 }}>Şifre</label>
            <input
              type="password"
              placeholder="Şifre (en az 6 karakter)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #cbd5e0',
                fontSize: 16,
                outline: 'none',
                transition: 'border 0.2s',
                boxSizing: 'border-box',
              }}
            />
            {!isPasswordValid && password.length > 0 && (
              <div style={{ color: '#e53e3e', fontSize: 13, marginTop: 4 }}>
                Şifre en az 6 karakter olmalı.
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!isFormValid || loading}
            style={{
              width: '100%',
              padding: '12px 0',
              borderRadius: 8,
              background: isFormValid && !loading ? '#3182ce' : '#a0aec0',
              color: '#fff',
              fontWeight: 600,
              fontSize: 17,
              border: 'none',
              cursor: isFormValid && !loading ? 'pointer' : 'not-allowed',
              boxShadow: '0 2px 8px rgba(49,130,206,0.08)',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
          {error && <div style={{ color: '#e53e3e', marginTop: 16, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
        </form>
      </div>
    </div>
  );
}
