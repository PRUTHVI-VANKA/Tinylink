'use client';

import { useState, useEffect } from 'react';
import { Link as LinkType } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Copy, ExternalLink, Link as LinkIcon, Search } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [targetUrl, setTargetUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links');
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (err) {
      console.error('Failed to fetch links:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_url: targetUrl,
          code: customCode || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create link');
        return;
      }

      setSuccess(`Link created! Short code: ${data.code}`);
      setTargetUrl('');
      setCustomCode('');
      fetchLinks();
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Link deleted successfully');
        fetchLinks();
      } else {
        setError('Failed to delete link');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const handleCopy = async (code: string) => {
    const url = `${baseUrl}/${code}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const filteredLinks = links.filter(
    (link) =>
      link.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.target_url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-2 pt-8">
          <div className="flex items-center justify-center gap-2">
            <LinkIcon className="h-8 w-8 text-slate-700" />
            <h1 className="text-4xl font-bold text-slate-900">URL Shortener</h1>
          </div>
          <p className="text-slate-600">Create short, memorable links in seconds</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Create New Short Link</CardTitle>
            <CardDescription>Enter a URL and optionally customize your short code</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="targetUrl" className="text-sm font-medium text-slate-700">
                  Target URL
                </label>
                <Input
                  id="targetUrl"
                  type="url"
                  placeholder="https://example.com/very/long/url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  required
                  disabled={isLoading}
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="customCode" className="text-sm font-medium text-slate-700">
                  Custom Code (optional)
                </label>
                <Input
                  id="customCode"
                  type="text"
                  placeholder="mycode (6-8 alphanumeric chars)"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  pattern="[A-Za-z0-9]{6,8}"
                  maxLength={8}
                  disabled={isLoading}
                  className="text-base"
                />
                <p className="text-xs text-slate-500">
                  Leave empty to auto-generate. Must be 6-8 letters/numbers.
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 text-green-900 border-green-200">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                {isLoading ? 'Creating...' : 'Create Short Link'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Links</CardTitle>
                <CardDescription>Manage all your shortened URLs</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search links..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredLinks.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                {searchQuery ? 'No links match your search' : 'No links yet. Create your first one above!'}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono font-semibold text-slate-900 bg-slate-100 px-2 py-1 rounded">
                          {link.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(link.code)}
                          className="h-7 px-2"
                        >
                          <Copy className="h-3 w-3" />
                          {copiedCode === link.code && (
                            <span className="ml-1 text-xs text-green-600">Copied!</span>
                          )}
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        <a
                          href={link.target_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate hover:text-slate-900 hover:underline"
                          title={link.target_url}
                        >
                          {link.target_url.length > 60
                            ? `${link.target_url.substring(0, 60)}...`
                            : link.target_url}
                        </a>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>
                          <strong>{link.click_count}</strong> clicks
                        </span>
                        {link.last_clicked_at && (
                          <span>
                            Last: {new Date(link.last_clicked_at).toLocaleDateString()}
                          </span>
                        )}
                        <span>
                          Created: {new Date(link.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/code/${link.code}`}>
                        <Button variant="outline" size="sm">
                          Stats
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(link.code)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
