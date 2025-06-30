'use client';

import React, { useState } from 'react';
import { css } from '../../styled-system/css';
import { flex, stack } from '../../styled-system/patterns';
import Link from 'next/link';

type RestaurantForm = {
  name: string;
  reading: string;
  categories: string[];
  address: string;
  nearest_station: string;
  regular_holiday: string;
  walkMinutes: number;
  crowdLevel: '空いている' | '普通' | '混雑';
  seats: number;
  seating: {
    total: number;
    counter: number | null;
    table: number | null;
    private_rooms: boolean;
  };
};

export default function AddRestaurant() {
  const [form, setForm] = useState<RestaurantForm>({
    name: '',
    reading: '',
    categories: [''],
    address: '',
    nearest_station: '',
    regular_holiday: '',
    walkMinutes: 0,
    crowdLevel: '普通',
    seats: 0,
    seating: {
      total: 0,
      counter: null,
      table: null,
      private_rooms: false,
    },
  });

  const [newCategory, setNewCategory] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const addCategory = () => {
    if (newCategory.trim() && !form.categories.includes(newCategory.trim())) {
      setForm(prev => ({
        ...prev,
        categories: [...prev.categories.filter(c => c !== ''), newCategory.trim()]
      }));
      setNewCategory('');
    }
  };

  const removeCategory = (index: number) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Remove empty categories
    const cleanedForm = {
      ...form,
      categories: form.categories.filter(c => c.trim() !== '')
    };
    
    // Here we would normally submit to an API
    // For now, we'll just show the formatted data for manual addition to spreadsheet
    console.log('Restaurant data to add:', cleanedForm);
    setIsSubmitted(true);
  };

  const generateCSVRow = () => {
    const cleanedForm = {
      ...form,
      categories: form.categories.filter(c => c.trim() !== '')
    };
    
    return [
      cleanedForm.name,
      cleanedForm.reading,
      cleanedForm.categories.join('|'), // Using | as separator for multiple categories
      cleanedForm.address,
      cleanedForm.nearest_station,
      cleanedForm.regular_holiday,
      cleanedForm.walkMinutes.toString(),
      cleanedForm.crowdLevel,
      cleanedForm.seats.toString(),
      cleanedForm.seating.total.toString(),
      cleanedForm.seating.counter?.toString() || '',
      cleanedForm.seating.table?.toString() || '',
      cleanedForm.seating.private_rooms ? '1' : '0'
    ].join(',');
  };

  const containerStyle = css({
    maxWidth: '800px',
    margin: '0 auto',
    padding: 'lg',
  });

  const headerStyle = css({
    textAlign: 'center',
    marginBottom: 'lg',
  });

  const formStyle = css({
    display: 'flex',
    flexDirection: 'column',
    gap: 'md',
  });

  const fieldGroupStyle = css({
    display: 'flex',
    flexDirection: 'column',
    gap: 'sm',
  });

  const labelStyle = css({
    fontWeight: 'bold',
    color: 'token(colors.text)',
  });

  const inputStyle = css({
    padding: 'md',
    border: '1px solid token(colors.border)',
    borderRadius: 'sm',
    fontSize: '16px',
  });

  const selectStyle = css({
    padding: 'md',
    border: '1px solid token(colors.border)',
    borderRadius: 'sm',
    fontSize: '16px',
    backgroundColor: 'white',
  });

  const checkboxStyle = css({
    marginRight: 'sm',
  });

  const buttonStyle = css({
    padding: '12px 24px',
    backgroundColor: 'token(colors.primary)',
    color: 'white',
    border: 'none',
    borderRadius: 'sm',
    cursor: 'pointer',
    fontSize: '16px',
    '&:hover': {
      backgroundColor: '#0060df',
    },
  });

  const secondaryButtonStyle = css({
    padding: '8px 16px',
    backgroundColor: 'token(colors.secondary)',
    color: 'token(colors.text)',
    border: '1px solid token(colors.border)',
    borderRadius: 'sm',
    cursor: 'pointer',
    fontSize: '14px',
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
  });

  const categoryListStyle = css({
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'sm',
    marginTop: 'sm',
  });

  const categoryTagStyle = css({
    display: 'flex',
    alignItems: 'center',
    gap: 'xs',
    padding: '4px 8px',
    backgroundColor: 'token(colors.secondary)',
    borderRadius: 'sm',
    fontSize: '14px',
  });

  const removeButtonStyle = css({
    background: 'none',
    border: 'none',
    color: '#ff4444',
    cursor: 'pointer',
    fontWeight: 'bold',
  });

  const seatingGroupStyle = css({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 'md',
    padding: 'md',
    border: '1px solid token(colors.border)',
    borderRadius: 'sm',
    backgroundColor: '#f9f9f9',
  });

  const resultStyle = css({
    padding: 'lg',
    border: '1px solid token(colors.border)',
    borderRadius: 'sm',
    backgroundColor: '#f0f8ff',
    marginTop: 'lg',
  });

  const codeBlockStyle = css({
    backgroundColor: '#f5f5f5',
    padding: 'md',
    borderRadius: 'sm',
    fontFamily: 'monospace',
    fontSize: '12px',
    overflowX: 'auto',
    marginTop: 'sm',
  });

  if (isSubmitted) {
    return (
      <div className={containerStyle}>
        <header className={headerStyle}>
          <h1>レストラン追加完了</h1>
        </header>
        <div className={resultStyle}>
          <h3>以下のデータがスプレッドシートに追加する準備が整いました：</h3>
          <div className={codeBlockStyle}>
            {generateCSVRow()}
          </div>
          <p style={{ marginTop: '16px' }}>
            上記のCSV形式のデータをGoogleスプレッドシートに手動で追加してください。
          </p>
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setIsSubmitted(false)} 
              className={secondaryButtonStyle}
            >
              別のレストランを追加
            </button>
            <Link href="/" className={buttonStyle} style={{ textDecoration: 'none' }}>
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerStyle}>
      <header className={headerStyle}>
        <h1>レストラン情報追加</h1>
        <p>新しいレストラン情報をスプレッドシートに追加します</p>
        <Link href="/" style={{ color: 'token(colors.primary)', textDecoration: 'underline' }}>
          ← ホームに戻る
        </Link>
      </header>

      <form onSubmit={handleSubmit} className={formStyle}>
        <div className={fieldGroupStyle}>
          <label className={labelStyle}>レストラン名 *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
            className={inputStyle}
            required
          />
        </div>

        <div className={fieldGroupStyle}>
          <label className={labelStyle}>読み方 *</label>
          <input
            type="text"
            value={form.reading}
            onChange={(e) => setForm(prev => ({ ...prev, reading: e.target.value }))}
            className={inputStyle}
            placeholder="ひらがなで入力"
            required
          />
        </div>

        <div className={fieldGroupStyle}>
          <label className={labelStyle}>カテゴリー</label>
          <div className={flex({ gap: 'sm' })}>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className={inputStyle}
              placeholder="カテゴリーを入力（例: ラーメン）"
              style={{ flexGrow: 1 }}
            />
            <button type="button" onClick={addCategory} className={secondaryButtonStyle}>
              追加
            </button>
          </div>
          <div className={categoryListStyle}>
            {form.categories.filter(c => c !== '').map((category, index) => (
              <div key={index} className={categoryTagStyle}>
                <span>{category}</span>
                <button 
                  type="button" 
                  onClick={() => removeCategory(index)}
                  className={removeButtonStyle}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={fieldGroupStyle}>
          <label className={labelStyle}>住所 *</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
            className={inputStyle}
            required
          />
        </div>

        <div className={fieldGroupStyle}>
          <label className={labelStyle}>最寄り駅 *</label>
          <input
            type="text"
            value={form.nearest_station}
            onChange={(e) => setForm(prev => ({ ...prev, nearest_station: e.target.value }))}
            className={inputStyle}
            required
          />
        </div>

        <div className={fieldGroupStyle}>
          <label className={labelStyle}>定休日</label>
          <input
            type="text"
            value={form.regular_holiday}
            onChange={(e) => setForm(prev => ({ ...prev, regular_holiday: e.target.value }))}
            className={inputStyle}
            placeholder="例: 月曜日、日曜・祝日"
          />
        </div>

        <div className={flex({ gap: 'md' })}>
          <div className={fieldGroupStyle} style={{ flex: 1 }}>
            <label className={labelStyle}>徒歩分数</label>
            <input
              type="number"
              value={form.walkMinutes}
              onChange={(e) => setForm(prev => ({ ...prev, walkMinutes: parseInt(e.target.value) || 0 }))}
              className={inputStyle}
              min="0"
            />
          </div>

          <div className={fieldGroupStyle} style={{ flex: 1 }}>
            <label className={labelStyle}>混雑レベル</label>
            <select
              value={form.crowdLevel}
              onChange={(e) => setForm(prev => ({ ...prev, crowdLevel: e.target.value as any }))}
              className={selectStyle}
            >
              <option value="空いている">空いている</option>
              <option value="普通">普通</option>
              <option value="混雑">混雑</option>
            </select>
          </div>
        </div>

        <div className={fieldGroupStyle}>
          <label className={labelStyle}>座席情報</label>
          <div className={seatingGroupStyle}>
            <div className={fieldGroupStyle}>
              <label>総座席数</label>
              <input
                type="number"
                value={form.seating.total}
                onChange={(e) => {
                  const total = parseInt(e.target.value) || 0;
                  setForm(prev => ({ 
                    ...prev, 
                    seats: total,
                    seating: { ...prev.seating, total } 
                  }));
                }}
                className={inputStyle}
                min="0"
              />
            </div>

            <div className={fieldGroupStyle}>
              <label>カウンター席</label>
              <input
                type="number"
                value={form.seating.counter || ''}
                onChange={(e) => setForm(prev => ({ 
                  ...prev, 
                  seating: { ...prev.seating, counter: e.target.value ? parseInt(e.target.value) : null } 
                }))}
                className={inputStyle}
                min="0"
                placeholder="なし"
              />
            </div>

            <div className={fieldGroupStyle}>
              <label>テーブル席</label>
              <input
                type="number"
                value={form.seating.table || ''}
                onChange={(e) => setForm(prev => ({ 
                  ...prev, 
                  seating: { ...prev.seating, table: e.target.value ? parseInt(e.target.value) : null } 
                }))}
                className={inputStyle}
                min="0"
                placeholder="なし"
              />
            </div>

            <div className={fieldGroupStyle}>
              <label>
                <input
                  type="checkbox"
                  checked={form.seating.private_rooms}
                  onChange={(e) => setForm(prev => ({ 
                    ...prev, 
                    seating: { ...prev.seating, private_rooms: e.target.checked } 
                  }))}
                  className={checkboxStyle}
                />
                個室あり
              </label>
            </div>
          </div>
        </div>

        <button type="submit" className={buttonStyle}>
          レストラン情報を追加
        </button>
      </form>
    </div>
  );
}