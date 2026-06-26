"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDocument } from "@/services/firebaseCrud";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { newsData } from "@/data/news";

export default function NewsArticle() {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getDocument('news', id as string);
        if (data) {
          setNewsItem(data);
        } else {
          // fallback to mock data if it matches
          const mock = newsData.find(n => n.id === id);
          if (mock) setNewsItem(mock);
        }
      } catch (err) {
        console.error("Failed to load news article:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchNews();
  }, [id]);

  if (loading) {
    return <div className="section container" style={{ textAlign: 'center', minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading article...</div>;
  }

  if (!newsItem) {
    return <div className="section container" style={{ textAlign: 'center', minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>News article not found.</div>;
  }

  return (
    <div className="section container" style={{ minHeight: '70vh' }}>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
        <ArrowLeft size={16} /> Back to Home
      </Link>
      
      <article style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--surface)', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--text-main)', lineHeight: '1.3' }}>
          {newsItem.title}
        </h1>
        
        {newsItem.image && (
          <div style={{ marginBottom: '2.5rem' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={newsItem.image} 
              alt={newsItem.title} 
              style={{ width: '100%', maxHeight: '450px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} 
            />
          </div>
        )}
        
        <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
          {newsItem.body}
        </div>
        
        {newsItem.linkUrl && (
          <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
            <a href={newsItem.linkUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-block' }}>
              {newsItem.linkText || "Read More"}
            </a>
          </div>
        )}
        
        {/* Support old static mock links array */}
        {newsItem.links && newsItem.links.length > 0 && (
          <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border)', paddingTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {newsItem.links.map((link: any, idx: number) => (
              <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                {link.text}
              </a>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
